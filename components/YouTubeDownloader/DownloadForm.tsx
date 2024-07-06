import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { downloadVideo } from '@/lib/api';
import { validateYouTubeUrl } from '@/lib/utils';

export const DownloadForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setProgress(0);
    setDownloadedFile(null);

    try {
      const filename = await downloadVideo(url, (progress, fileSize) => {
        setProgress(progress);
      });
      setDownloadedFile(filename);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while downloading the video.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
        {isLoading && (
          <div className="w-full">
            <Progress value={progress} className="w-full" />
            <p className="text-center mt-2">{progress.toFixed(2)}% downloaded</p>
          </div>
        )}
        {downloadedFile && (
          <Alert>
            <AlertTitle>Download Complete</AlertTitle>
            <AlertDescription>File &quot;{downloadedFile}&quot; has been downloaded.</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
};
