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
    
    return NextResponse.json({ 
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
    })
  } catch (error) {
    console.error('Error in getInfo:', error)
    return NextResponse.json({ error: 'An error occurred while fetching video info' }, { status: 500 })
  }
}