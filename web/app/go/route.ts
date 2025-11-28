import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const site = searchParams.get('site');

  if (site) {
    // INTENTIONAL VULNERABILITY: Open redirect
    return NextResponse.redirect(site);
  }

  return NextResponse.json({ error: 'No site parameter provided' }, { status: 400 });
}
