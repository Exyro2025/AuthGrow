import { NextResponse } from 'next/server';
import { getIG } from '../../auth/ig/callback/route';

type Body = { media_type: 'PHOTO'|'VIDEO'|'REELS', media_url: string, caption?: string, scheduled_at?: string | null };
const JOBS: any[] = []; // in-memory demo

export async function POST(req: Request) {
  const { token, igUserId } = getIG();
  if (!token || !igUserId) return NextResponse.json({ ok:false, error:'Not connected' }, { status: 400 });

  const body = await req.json() as Body;
  if (!body?.media_url || !body?.media_type) return NextResponse.json({ ok:false, error:'Missing fields' }, { status: 400 });

  const when = body.scheduled_at ? new Date(body.scheduled_at) : new Date();
  const job = { id: Date.now(), status: 'scheduled', ...body, when: when.toISOString() };
  JOBS.push(job);
  return NextResponse.json({ ok:true, id: job.id });
}
export function getJobs(){ return JOBS; }
