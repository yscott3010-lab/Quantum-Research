import { NextResponse } from 'next/server';

const DUNE_QUERY_ID = '6647840';

export async function GET() {
  const apiKey = process.env.DUNE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Dune API key not configured. Add DUNE_API_KEY to Vercel environment variables.' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results?limit=1000`,
      {
        headers: { 'x-dune-api-key': apiKey },
        // Revalidate every 5 minutes
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Dune API error: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch from Dune Analytics.' },
      { status: 500 }
    );
  }
}
