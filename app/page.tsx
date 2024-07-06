"use client"

import { DownloadForm } from '@/components/YouTubeDownloader/DownloadForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">YouTube Downloader</h1>
      <DownloadForm />
    </main>
  );
}
