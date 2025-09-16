import { NextResponse } from 'next/server';
import { getIG } from '../../auth/ig/callback/route';
import { getJobs } from '../create/route';

async function createContainer(igUserId: string, token: string, media_type: string, media_url: string, caption?: string|null) {
  const url = new URL(`https://graph.facebook.com/v20.0/${igUserId}/media`);
  if (media_type === 'PHOTO') url.searchParams.set('image_url', media_url); else url.searchParams.set('video_url', media_url);
  if (media_type === 'REELS') url.searchParams.set('media_type', 'REELS');
  if (caption) url.searchParams.set('caption', caption);
  url.searchParams.set('access_token', token);
  const res = await fetch(url.toString(), { method: 'POST' }); const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(`container error: ${JSON.stringify(data)}`); return data;
}
async function containerStatus(creationId: string, token: string) {
  const url = new URL(`https://graph.facebook.com/v20.0/${creationId}`);
  url.searchParams.set('fields', 'status_code,status'); url.searchParams.set('access_token', token);
  const res = await fetch(url.toString()); if (!res.ok) return null; return res.json();
}
async function publish(igUserId: string, token: string, creationId: string) {
  const url = new URL(`https://graph.facebook.com/v20.0/${igUserId}/media_publish`);
  url.searchParams.set('creation_id', creationId); url.searchParams.set('access_token', token);
  const res = await fetch(url.toString(), { method: 'POST' }); const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(`publish error: ${JSON.stringify(data)}`); return data;
}

export async function GET() {
  const { token, igUserId } = getIG();
  if (!token || !igUserId) return NextResponse.json({ ok:false, error:'Not connected' }, { status: 400 });

  const jobs = getJobs(); const nowISO = new Date().toISOString(); const results:any[] = [];
  for (const j of jobs) {
    if (j.status === 'scheduled' && j.when <= nowISO) {
      try { const c = await createContainer(igUserId, token, j.media_type, j.media_url, j.caption || null);
        j.status='container_created'; j.creation_id=c.id; results.push({ id:j.id, step:'container_created', creation_id:c.id });
      } catch(e:any){ j.status='failed'; j.error=e?.message||'container failed'; results.push({ id:j.id, step:'failed', error:j.error }); }
    } else if (j.status === 'container_created') {
      const st = await containerStatus(j.creation_id, token);
      if (st?.status_code === 'FINISHED') {
        try { const pub = await publish(igUserId, token, j.creation_id);
          j.status='published'; j.ig_media_id=pub.id; j.published_at=new Date().toISOString();
          results.push({ id:j.id, step:'published', ig_media_id: pub.id });
        } catch(e:any){ j.status='failed'; j.error=e?.message||'publish failed'; results.push({ id:j.id, step:'failed', error:j.error }); }
      }
    }
  }
  return NextResponse.json({ ok:true, processed: results });
}
