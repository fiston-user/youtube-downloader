import axios from 'axios';

export const downloadVideo = async (
  url: string,
  onProgress: (progress: number, fileSize: number) => void
) => {
  try {
    const response = await axios.post(
      '/api/download',
      { url },
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          onProgress(percentCompleted, progressEvent.total ?? 0);
        },
      }
    );

    console.log('Response headers:', response.headers);
    console.log('Content-Type:', response.headers['content-type']);

    const contentDisposition = response.headers['content-disposition'];
    let filename = 'video.mp4';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
      }
    }

    console.log('Filename:', filename);

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'video/mp4',
    });
    console.log('Blob size:', blob.size);

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return filename;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server responded with error:', error.response.data);
      throw new Error(`Server error: ${error.response.data.error || 'Unknown error'}`);
    } else if (axios.isAxiosError(error) && error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error setting up request:', error);
      throw new Error('Error setting up request');
    }
  }
};
