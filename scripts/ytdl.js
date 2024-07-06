const ytdl = require('ytdl-core');

async function debugYtdl(url) {
  try {
    const info = await ytdl.getInfo(url);
    console.log('Video Title:', info.videoDetails.title);
    console.log('Available Formats:');
    info.formats.forEach(format => {
      console.log(`- itag: ${format.itag}, qualityLabel: ${format.qualityLabel}, container: ${format.container}, codecs: ${format.codecs}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Replace with a YouTube video URL
debugYtdl('https://youtu.be/dQw4w9WgXcQ?si=Ln1x-tPi3y3LR3Ma');