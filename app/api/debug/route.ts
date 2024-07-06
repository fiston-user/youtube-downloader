import { NextRequest, NextResponse } from 'next/server'
import ytdl from 'ytdl-core'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
  }

  try {
    const info = await ytdl.getInfo(url)
    
    const debugInfo = {
      title: info.videoDetails.title,
      formats: info.formats.map(format => ({
        itag: format.itag,
        qualityLabel: format.qualityLabel,
        container: format.container,
        codecs: format.codecs,
        hasAudio: !!format.audioCodec,
        hasVideo: !!format.videoCodec,
        bitrate: format.bitrate,
      })),
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('Error in getInfo:', error)
    return NextResponse.json({ error: 'An error occurred while fetching video info' }, { status: 500 })
  }
}