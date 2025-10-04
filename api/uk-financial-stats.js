/* eslint-env node */
import * as cheerio from 'cheerio';

const USER_AGENT = 'CalcMyMoney.co.uk/uk-financial-stats (+https://www.calcmymoney.co.uk)';
const BANK_OF_ENGLAND_PAGE = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';

function tryParseDate(value) {
  const cleaned = value?.trim();
  if (!cleaned) return null;
  const d = new Date(cleaned);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  try {
    // Fetch the page HTML
    const response = await fetch(BANK_OF_ENGLAND_PAGE, {
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml',
        referer: 'https://www.bankofengland.co.uk/',
      },
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`BoE fetch failed: ${response.status} ${txt.slice(0, 100)}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to find the rate value and date
    // The Bank Rate is usually in a table row with headings “Bank Rate” or “Official Bank Rate”
    let rateValue = null;
    let rateDate = null;

    $('table tr').each((_, el) => {
      const tds = $(el).find('td');
      const rowText = $(el).text().toLowerCase();
      if (rowText.includes('bank rate') && tds.length >= 2) {
        const val = $(tds[1]).text().trim().replace('%', '');
        const dateText = $(tds[2]).text().trim() || $(tds[0]).text().trim();
        const value = parseFloat(val);
        if (!Number.isNaN(value)) {
          rateValue = value;
          rateDate = tryParseDate(dateText);
        }
      }
    });

    if (!rateValue) {
      throw new Error('Could not locate Bank Rate in HTML');
    }

    const result = {
      stats: {
        bankRate: {
          value: rateValue,
          unit: 'percent',
          period: { start: rateDate },
          title: 'BoE Bank Rate',
          source: {
            name: 'Bank of England',
            url: BANK_OF_ENGLAND_PAGE,
          },
        },
      },
      generatedAt: new Date().toISOString(),
      errors: {},
      status: 'ok',
    };

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=21600');
    return res.status(200).json(result);
  } catch (error) {
    console.error('[BoE] scrape failed:', error);
    res.setHeader('Cache-Control', 's-maxage=600');
    return res.status(200).json({
      status: 'error',
      errors: { bankRate: error.message },
      stats: {},
    });
  }
}
