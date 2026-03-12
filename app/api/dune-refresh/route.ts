import { NextResponse } from 'next/server';

const DUNE_QUERY_ID = '6647840';

// Called daily by Vercel Cron Job to keep the Dune query fresh.
export async function GET() {
  const apiKey = process.env.DUNE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'DUNE_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Trigger a fresh execution of the query
    const execRes = await fetch(
      `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/execute`,
      {
        method: 'POST',
        headers: {
          'x-dune-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    if (!execRes.ok) {
      return NextResponse.json(
        { error: `Dune execute error: ${execRes.status}` },
        { status: execRes.status }
      );
    }

    const execData = await execRes.json();
    const executionId: string = execData.execution_id;

    // Poll until complete (up to 55 seconds — Vercel Pro limit is 60s)
    const deadline = Date.now() + 55_000;
    let state = 'QUERY_STATE_PENDING';

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 3000));

      const statusRes = await fetch(
        `https://api.dune.com/api/v1/execution/${executionId}/status`,
        { headers: { 'x-dune-api-key': apiKey } }
      );

      if (!statusRes.ok) break;

      const statusData = await statusRes.json();
      state = statusData.state;

      if (state === 'QUERY_STATE_COMPLETED' || state === 'QUERY_STATE_FAILED') break;
    }

    return NextResponse.json({
      ok: true,
      execution_id: executionId,
      state,
      refreshed_at: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
