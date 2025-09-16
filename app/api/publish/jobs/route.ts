import { NextResponse } from 'next/server';
import { getJobs } from '../create/route';
export async function GET(){ return NextResponse.json({ ok:true, data: getJobs() }); }
