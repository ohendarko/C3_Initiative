import React from 'react'

const IntroVideo = () => {
  return (
    <div>
      <div className="container !px-1 mx-auto max-w-4xl">
        <iframe
          src="https://drive.google.com/file/d/1e0TZpSns-EaZ5S4QUSr_AfQOUBRIguk_/preview?usp=drivesdk"
          width="100%"
          height="100%"
          allow="autoplay"
          allowFullScreen
          className="rounded-lg w-full aspect-video"
        />
      </div>
    </div>
  )
}

export default IntroVideo