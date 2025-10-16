import { NextResponse } from "next/server";

export async function GET() {
  const external =
    process.env.VEHICLES_API_URL ||
    "https://www.amanabootcamp.org/api/fs-classwork-data/amana-transportation";

  try {
    const res = await fetch(external, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();

    // Keep the original payload so front-end can read company_info, operational_summary, etc.
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
