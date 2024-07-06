import { NextRequest, NextResponse } from 'next/server'
import ytdl from 'ytdl-core'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
})

export async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { url } = await req.json()

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
  }

  try {
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' })

    if (!format) {
      return NextResponse.json({ error: 'No suitable format found' }, { status: 400 })
    }

    const videoStream = ytdl(url, { format: format })
    const response = new NextResponse(videoStream as any)
    response.headers.set('Content-Type', format.mimeType || 'video/mp4')
    response.headers.set('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`)
    
    // Set the Content-Length header if available
    if (format.contentLength) {
      response.headers.set('Content-Length', format.contentLength)
    }
    
    return response
  } catch (error: any) {
    console.error(error)
    if (error.message.includes('Status code: 410')) {
      return NextResponse.json({ error: 'This video is no longer available' }, { status: 410 })
    }
    return NextResponse.json({ error: 'An error occurred while processing the video' }, { status: 500 })
  }
}