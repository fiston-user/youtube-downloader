import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
});

function sanitizeFilename(filename: string): string {
  // Remove emojis and other non-ASCII characters
  return (
    filename
      .replace(/[^\x00-\x7F]/g, '')
      // Replace spaces with underscores
      .replace(/\s+/g, '_')
      // Remove any remaining unsafe characters
      .replace(/[^a-zA-Z0-9_.-]/g, '') ||
    // Ensure the filename is not empty
    'video'
  );
}

export async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highest',
      filter: 'videoandaudio',
    });

    if (!format) {
      return NextResponse.json({ error: 'No suitable format found' }, { status: 400 });
    }

    const stream = ytdl(url, { format: format });
    const response = new NextResponse(stream as any);
    response.headers.set('Content-Type', format.mimeType || 'video/mp4');

    const sanitizedFilename = sanitizeFilename(info.videoDetails.title);
    response.headers.set('Content-Disposition', `attachment; filename="${sanitizedFilename}.mp4"`);

    if (format.contentLength) {
      response.headers.set('Content-Length', format.contentLength);
    }

    return response;
  } catch (error: any) {
    console.error('Error in download:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the video' },
      { status: 500 }
    );
  }
}
