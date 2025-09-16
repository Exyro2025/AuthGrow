import { NextRequest, NextResponse } from 'next/server';
let IG: { token?: string; igUserId?: string } = {};

export async function GET(req: NextRequest) {
  const appId = process.env.META_APP_ID as string;
  const appSecret = process.env.META_APP_SECRET as string;
  const base = process.env.PUBLIC_BASE_URL as string;
  if (!appId || !appSecret || !base) return NextResponse.json({ ok:false, error:'Missing env vars' }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code'); const error = searchParams.get('error');
  if (error) return NextResponse.json({ ok:false, error }, { status: 400 });
  if (!code) return NextResponse.json({ ok:false, error:'Missing code' }, { status: 400 });

  const tokURL = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
  tokURL.searchParams.set('client_id', appId);
  tokURL.searchParams.set('client_secret', appSecret);
  tokURL.searchParams.set('redirect_uri', `${base}/api/auth/ig/callback`);
  tokURL.searchParams.set('code', code);
  const tokRes = await fetch(tokURL.toString());
  if (!tokRes.ok) return NextResponse.json({ ok:false, error:'token exchange failed' }, { status: 500 });
  const tok = await tokRes.json() as { access_token: string };

  const igRes = await fetch(`https://graph.facebook.com/v20.0/me/instagram_accounts?access_token=${tok.access_token}`);
  const ig = await igRes.json(); const igUserId = ig?.data?.[0]?.id;
  if (!igUserId) return NextResponse.json({ ok:false, error:'No Instagram professional account found' }, { status: 400 });

  IG.token = tok.access_token; IG.igUserId = igUserId;
  return NextResponse.redirect(`${base}/publish`);
}

export function getIG() { return { ...IG }; }
