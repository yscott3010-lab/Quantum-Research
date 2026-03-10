import { NextResponse } from 'next/server';

const SP500_SECTORS = [
  { symbol: 'XLK',  name: 'Technology',       weight: 31 },
  { symbol: 'XLF',  name: 'Financials',        weight: 14 },
  { symbol: 'XLV',  name: 'Healthcare',        weight: 12 },
  { symbol: 'XLY',  name: 'Consumer Disc.',    weight: 10 },
  { symbol: 'XLC',  name: 'Communication',     weight: 9  },
  { symbol: 'XLI',  name: 'Industrials',       weight: 8  },
  { symbol: 'XLP',  name: 'Consumer Staples',  weight: 6  },
  { symbol: 'XLE',  name: 'Energy',            weight: 4  },
  { symbol: 'XLU',  name: 'Utilities',         weight: 2.3},
  { symbol: 'XLRE', name: 'Real Estate',       weight: 2.2},
  { symbol: 'XLB',  name: 'Materials',         weight: 2.5},
];

const FUTURES_ITEMS = [
  // Indices
  { symbol: 'ES=F',     name: 'S&P 500',       group: 'INDICES', weight: 25 },
  { symbol: 'NQ=F',     name: 'Nasdaq 100',    group: 'INDICES', weight: 18 },
  { symbol: 'YM=F',     name: 'Dow Jones',     group: 'INDICES', weight: 10 },
  { symbol: 'RTY=F',    name: 'Russell 2000',  group: 'INDICES', weight: 7  },
  // Energy
  { symbol: 'CL=F',     name: 'Crude Oil WTI', group: 'ENERGY',  weight: 15 },
  { symbol: 'BZ=F',     name: 'Crude Oil Brent',group: 'ENERGY', weight: 14 },
  { symbol: 'NG=F',     name: 'Natural Gas',   group: 'ENERGY',  weight: 6  },
  { symbol: 'RB=F',     name: 'Gasoline RBOB', group: 'ENERGY',  weight: 4  },
  { symbol: 'HO=F',     name: 'Heating Oil',   group: 'ENERGY',  weight: 3  },
  // Metals
  { symbol: 'GC=F',     name: 'Gold',          group: 'METALS',  weight: 18 },
  { symbol: 'SI=F',     name: 'Silver',        group: 'METALS',  weight: 9  },
  { symbol: 'HG=F',     name: 'Copper',        group: 'METALS',  weight: 7  },
  { symbol: 'PL=F',     name: 'Platinum',      group: 'METALS',  weight: 5  },
  { symbol: 'PA=F',     name: 'Palladium',     group: 'METALS',  weight: 4  },
  // Grains
  { symbol: 'ZC=F',     name: 'Corn',          group: 'GRAINS',  weight: 10 },
  { symbol: 'ZS=F',     name: 'Soybeans',      group: 'GRAINS',  weight: 10 },
  { symbol: 'ZW=F',     name: 'Wheat',         group: 'GRAINS',  weight: 8  },
  { symbol: 'ZM=F',     name: 'Soybean Meal',  group: 'GRAINS',  weight: 4  },
  { symbol: 'ZL=F',     name: 'Soybean Oil',   group: 'GRAINS',  weight: 4  },
  // Softs
  { symbol: 'KC=F',     name: 'Coffee',        group: 'SOFTS',   weight: 8  },
  { symbol: 'SB=F',     name: 'Sugar',         group: 'SOFTS',   weight: 8  },
  { symbol: 'CC=F',     name: 'Cocoa',         group: 'SOFTS',   weight: 6  },
  { symbol: 'CT=F',     name: 'Cotton',        group: 'SOFTS',   weight: 5  },
  { symbol: 'OJ=F',     name: 'Orange Juice',  group: 'SOFTS',   weight: 3  },
  // Bonds
  { symbol: 'ZN=F',     name: '10 Year Note',  group: 'BONDS',   weight: 18 },
  { symbol: 'ZB=F',     name: '30 Year Bond',  group: 'BONDS',   weight: 14 },
  { symbol: 'ZT=F',     name: '2 Year Note',   group: 'BONDS',   weight: 10 },
  { symbol: 'ZF=F',     name: '5 Year Note',   group: 'BONDS',   weight: 10 },
  // Currencies
  { symbol: 'EURUSD=X', name: 'EUR',           group: 'CURRENCIES', weight: 22 },
  { symbol: 'JPY=X',    name: 'JPY',           group: 'CURRENCIES', weight: 14 },
  { symbol: 'GBPUSD=X', name: 'GBP',           group: 'CURRENCIES', weight: 12 },
  { symbol: 'CADUSD=X', name: 'CAD',           group: 'CURRENCIES', weight: 8  },
  { symbol: 'AUDUSD=X', name: 'AUD',           group: 'CURRENCIES', weight: 8  },
  { symbol: 'CHFUSD=X', name: 'CHF',           group: 'CURRENCIES', weight: 6  },
  { symbol: 'NZDUSD=X', name: 'NZD',           group: 'CURRENCIES', weight: 5  },
  // Meats
  { symbol: 'LE=F',     name: 'Live Cattle',   group: 'MEATS',   weight: 10 },
  { symbol: 'HE=F',     name: 'Lean Hogs',     group: 'MEATS',   weight: 8  },
  { symbol: 'GF=F',     name: 'Feeder Cattle', group: 'MEATS',   weight: 6  },
];

async function fetchQuotes(symbols: string[]): Promise<Record<string, number>> {
  const joined = symbols.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(joined)}&fields=regularMarketChangePercent`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://finance.yahoo.com/',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Yahoo Finance returned ${res.status}`);

  const json = await res.json();
  const results: Array<{ symbol: string; regularMarketChangePercent?: number }> =
    json?.quoteResponse?.result ?? [];

  return Object.fromEntries(
    results.map((q) => [q.symbol, q.regularMarketChangePercent ?? 0])
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'sp500';
  const items = type === 'futures' ? FUTURES_ITEMS : SP500_SECTORS;

  let quotesMap: Record<string, number> = {};
  let liveData = true;

  try {
    quotesMap = await fetchQuotes(items.map((i) => i.symbol));
  } catch {
    liveData = false;
  }

  const data = items.map((item) => ({
    name: item.name,
    symbol: item.symbol,
    size: item.weight,
    changePercent: quotesMap[item.symbol] ?? 0,
    group: 'group' in item ? item.group : 'SECTORS',
  }));

  return NextResponse.json({ data, liveData });
}
