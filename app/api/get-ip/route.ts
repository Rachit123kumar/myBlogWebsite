import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0] ?? 'Unknown';

  const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
  const location = await geoRes.json();

  console.log(ip,location)
  return NextResponse.json({ ip, location });
}
