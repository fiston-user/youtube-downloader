import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorDisplayProps {
  error: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null

  return (
    <Alert variant="destructive" className="mt-4 w-full max-w-md">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}