'use client';
import { useState } from 'react';

export default function PublishPage(){
  const [mediaType, setMediaType] = useState<'PHOTO'|'VIDEO'|'REELS'>('PHOTO');
  const [url, setUrl] = useState(''); const [caption, setCaption] = useState('');
  const [when, setWhen] = useState<string>(''); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);

  async function submit(){
    setBusy(true); setMsg('');
    try{
      const res = await fetch('/api/publish/create', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ media_type: mediaType, media_url: url, caption, scheduled_at: when ? new Date(when).toISOString() : null })
      });
      const data = await res.json(); if(!res.ok) throw new Error(data?.error || 'Failed');
      setMsg(when ? 'Scheduled. Cron will publish around that time.' : 'Queued to publish now.');
      setUrl(''); setCaption(''); setWhen('');
    }catch(e:any){ setMsg('Error: '+(e?.message||'unknown')); } finally { setBusy(false); }
  }

  return (
    <main style={{maxWidth:720,margin:"24px auto",padding:"0 16px",fontFamily:"system-ui, sans-serif"}}>
      <h2>Publish</h2>
      <p>Paste a <strong>public</strong> image/video URL (Dropbox/Drive direct link, S3, etc.).</p>
      <label>Media Type</label><br/>
      <select value={mediaType} onChange={e=>setMediaType(e.target.value as any)}>
        <option value="PHOTO">Photo</option><option value="VIDEO">Video</option><option value="REELS">Reel</option>
      </select><br/><br/>
      <label>Media URL</label><br/>
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." style={{width:'100%'}}/><br/><br/>
      <label>Caption</label><br/>
      <textarea value={caption} onChange={e=>setCaption(e.target.value)} rows={4} style={{width:'100%'}}/><br/><br/>
      <label>Schedule (optional)</label><br/>
      <input type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)} /><br/><br/>
      <button disabled={busy} onClick={submit}>Submit</button>
      <p>{msg}</p>
      <p style={{fontSize:12,color:"#666"}}>Job status: <a href="/api/publish/jobs">/api/publish/jobs</a></p>
    </main>
  );
}
