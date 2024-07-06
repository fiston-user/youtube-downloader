import React from 'react'
import { Progress } from "@/components/ui/progress"
import { formatFileSize } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  fileSize: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, fileSize }) => {
  return (
    <div className="w-full max-w-md mt-4">
      <Progress value={progress} className="w-full" />
      <p className="text-center mt-2">
        {progress}% downloaded ({formatFileSize(fileSize * progress / 100)} of {formatFileSize(fileSize)})
      </p>
    </div>
  )
}