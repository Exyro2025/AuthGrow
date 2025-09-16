import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.META_APP_ID;
  const base = process.env.PUBLIC_BASE_URL; // e.g., https://authgrow.vercel.app
  if (!appId || !base) return NextResponse.json({ error: 'Missing META_APP_ID or PUBLIC_BASE_URL' }, { status: 500 });

  const redirect = encodeURIComponent(`${base}/api/auth/ig/callback`);
  const scope = encodeURIComponent([
    'instagram_business_basic',
    'instagram_business_content_publish',
    'instagram_business_manage_comments',
    'instagram_business_manage_insights'
  ].join(','));

  const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirect}&response_type=code&scope=${scope}`;
  return NextResponse.redirect(url);
}
