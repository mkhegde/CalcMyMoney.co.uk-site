// /api/uk-financial-stats.js
export const config = { runtime: 'nodejs' };

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

async function get(path) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 9000);
  try {
    const r = await fetch(path, {
      headers: { accept: 'application/json', 'user-agent': UA },
      signal: ctl.signal,
      cache: 'no-store',
    });
    if (!r.ok) throw new Error(`${path} → ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  const out = { stats: {}, errors: {} };

  await Promise.all([
    get(
      `${req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://` : ''}${req.headers.host}/api/boe/bank-rate`
    ).then(
      (j) => (out.stats.bankRate = j),
      (e) => (out.errors.bankRate = String(e))
    ),
    get(
      `${req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://` : ''}${req.headers.host}/api/ons/cpih`
    ).then(
      (j) => (out.stats.cpih = j),
      (e) => (out.errors.cpih = String(e))
    ),
    get(
      `${req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://` : ''}${req.headers.host}/api/ukhpi/average-price`
    ).then(
      (j) => (out.stats.housePrice = j),
      (e) => (out.errors.housePrice = String(e))
    ),
    get(
      `${req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://` : ''}${req.headers.host}/api/ofgem/price-cap`
    ).then(
      (j) => (out.stats.ofgemCap = j),
      (e) => (out.errors.ofgemCap = String(e))
    ),
  ]);

  res.status(200).json(out);
}
