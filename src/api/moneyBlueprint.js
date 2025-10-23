import { InvokeLLM } from './integrations';

const getRuntimeEnv = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }
  return {};
};

const ENV = getRuntimeEnv();

const getEnvValue = (...keys) => {
  for (const key of keys) {
    if (key in ENV && ENV[key] !== undefined) {
      return ENV[key];
    }
  }
  return undefined;
};

const DEFAULT_PROVIDER = getEnvValue(
  'VITE_BLUEPRINT_AI_PROVIDER',
  'NEXT_PUBLIC_BLUEPRINT_AI_PROVIDER',
  'BLUEPRINT_AI_PROVIDER'
);

const DEFAULT_ENDPOINT = getEnvValue(
  'VITE_BLUEPRINT_AI_ENDPOINT',
  'NEXT_PUBLIC_BLUEPRINT_AI_ENDPOINT',
  'BLUEPRINT_AI_ENDPOINT'
);

const DEFAULT_HTTP_ENDPOINT = '/api/blueprint-ai';

const pickEndpoint = (explicitEndpoint) => explicitEndpoint ?? DEFAULT_ENDPOINT ?? DEFAULT_HTTP_ENDPOINT;

const extractFromArrayContent = (value) => {
  if (!Array.isArray(value)) return undefined;
  return value
    .map((item) => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        return item.text ?? item.content ?? item.value ?? '';
      }
      return `${item}`;
    })
    .filter(Boolean)
    .join('\n');
};

const extractAiContent = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;

  if (typeof payload.content === 'string') return payload.content;
  const arrayContent = extractFromArrayContent(payload.content);
  if (arrayContent) return arrayContent;

  if (payload.message && typeof payload.message.content === 'string') {
    return payload.message.content;
  }

  if (Array.isArray(payload.choices)) {
    const choiceContent = payload.choices
      .map((choice) => {
        if (typeof choice === 'string') return choice;
        if (choice?.message?.content) return choice.message.content;
        return extractFromArrayContent(choice?.message?.content) ?? choice?.text ?? '';
      })
      .filter(Boolean)
      .join('\n\n');
    if (choiceContent) return choiceContent;
  }

  if (payload.data) {
    const data = payload.data;
    if (typeof data === 'string') return data;
    const dataArrayContent = extractFromArrayContent(data);
    if (dataArrayContent) return dataArrayContent;
    if (Array.isArray(data?.choices)) {
      const combined = data.choices
        .map((choice) => {
          if (choice?.message?.content) return choice.message.content;
          if (Array.isArray(choice?.message?.content)) {
            return extractFromArrayContent(choice.message.content);
          }
          return choice?.text ?? '';
        })
        .filter(Boolean)
        .join('\n\n');
      if (combined) return combined;
    }
    if (typeof data?.output_text === 'string') return data.output_text;
  }

  if (typeof payload.result === 'string') return payload.result;
  if (typeof payload.output === 'string') return payload.output;
  if (typeof payload.response === 'string') return payload.response;

  return '';
};

const prepareBasePayload = (prompt) => ({
  reportId: prompt.reportId ?? null,
  messages: prompt.messages ?? [],
  summaryBullets: prompt.summaryBullets ?? [],
  riskFlags: prompt.riskFlags ?? [],
  data: prompt.sanitisedData ?? {},
  disclaimer: prompt.disclaimer ?? null,
  fingerprint: prompt.fingerprint ?? null,
});

const ensurePrompt = (prompt) => {
  if (!prompt || !Array.isArray(prompt.messages) || prompt.messages.length === 0) {
    throw new Error('callMoneyBlueprintAI requires a prompt with at least one message.');
  }
  return prompt;
};

const callInvokeLLM = async (prompt) => {
  const payload = prepareBasePayload(prompt);
  const response = await InvokeLLM({
    messages: prompt.messages,
    metadata: {
      reportId: payload.reportId,
      moneyBlueprint: payload,
    },
  });

  if (!response || response.ok === false) {
    const errorMessage = response?.error ?? 'InvokeLLM call failed.';
    const error = new Error(errorMessage);
    error.cause = response;
    throw error;
  }

  const content = extractAiContent(response) || extractAiContent(response?.data);
  return { ok: true, provider: 'invoke-llm', content, raw: response };
};

const parseHttpResponse = async (response) => {
  const contentType = response.headers?.get?.('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      return { error, raw: await response.text() };
    }
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
};

const callHttpProvider = async (prompt, endpoint, signal) => {
  const payload = prepareBasePayload(prompt);
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch API is not available to call the AI endpoint.');
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`AI request failed with status ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  const data = await parseHttpResponse(response);
  const content = extractAiContent(data);
  return { ok: true, provider: 'http', content, raw: data };
};

export async function callMoneyBlueprintAI(options = {}) {
  const { prompt: promptPayload, provider, signal, endpoint } = options ?? {};
  const prompt = ensurePrompt(promptPayload);

  const resolvedProvider = provider ?? DEFAULT_PROVIDER ?? (endpoint || DEFAULT_ENDPOINT ? 'http' : 'invoke-llm');

  if (resolvedProvider === 'invoke-llm' || resolvedProvider === 'base44') {
    return callInvokeLLM(prompt);
  }

  const targetEndpoint = pickEndpoint(endpoint);
  if (!targetEndpoint) {
    throw new Error('No AI endpoint configured for HTTP provider.');
  }

  return callHttpProvider(prompt, targetEndpoint, signal);
}

