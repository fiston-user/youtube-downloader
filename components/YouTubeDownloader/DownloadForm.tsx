import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { downloadVideo } from '@/lib/api'
import { validateYouTubeUrl } from '@/lib/utils'

interface DownloadFormProps {
  onDownloadStart: () => void
  onDownloadProgress: (progress: number, fileSize: number) => void
  onDownloadComplete: () => void
  onError: (error: string) => void
}

export const DownloadForm: React.FC<DownloadFormProps> = ({
  onDownloadStart,
  onDownloadProgress,
  onDownloadComplete,
  onError
}) => {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateYouTubeUrl(url)) {
      onError('Please enter a valid YouTube URL')
      return
    }

    setIsLoading(true)
    onDownloadStart()

    try {
      await downloadVideo(url, onDownloadProgress)
      onDownloadComplete()
    } catch (error: any) {
      onError(error.message || 'An error occurred while downloading the video.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col space-y-4">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Downloading...' : 'Download'}
        </Button>
      </div>
    </form>
  )
}