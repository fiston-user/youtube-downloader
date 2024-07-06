'use client'

import React, { useState } from 'react'
import { DownloadForm } from '@/components/YouTubeDownloader/DownloadForm'
import { ProgressBar } from '@/components/YouTubeDownloader/ProgressBar'
import { ErrorDisplay } from '@/components/YouTubeDownloader/ErrorDisplay'
import type { DownloadProgress } from '@/app/types'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({ progress: 0, fileSize: 0 })

  const handleDownloadStart = () => {
    setIsLoading(true)
    setError('')
    setDownloadProgress({ progress: 0, fileSize: 0 })
  }

  const handleDownloadProgress = (progress: number, fileSize: number) => {
    setDownloadProgress({ progress, fileSize })
  }

  const handleDownloadComplete = () => {
    setIsLoading(false)
  }

  const handleError = (error: string) => {
    setError(error)
    setIsLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">YouTube Downloader</h1>
      <DownloadForm
        onDownloadStart={handleDownloadStart}
        onDownloadProgress={handleDownloadProgress}
        onDownloadComplete={handleDownloadComplete}
        onError={handleError}
      />
      {isLoading && (
        <ProgressBar
          progress={downloadProgress.progress}
          fileSize={downloadProgress.fileSize}
        />
      )}
      <ErrorDisplay error={error} />
    </main>
  )
}