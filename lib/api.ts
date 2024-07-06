import axios from 'axios'

export const downloadVideo = async (
  url: string,
  onProgress: (progress: number, fileSize: number) => void
) => {
  const response = await axios.post('/api/download', { url }, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1))
      onProgress(percentCompleted, progressEvent.total ?? 0)
    }
  })

  const blob = new Blob([response.data], { type: 'video/mp4' })
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = 'video.mp4'
  document.body.appendChild(link)
  link.click()
  link.remove()
}