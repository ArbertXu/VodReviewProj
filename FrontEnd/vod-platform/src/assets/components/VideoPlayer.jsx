import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !src) return;

    // Destroy old player if exists
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // Initialize new player
    playerRef.current = videojs(videoElement, {
      controls: true,
      autoplay: false,
      preload: "auto",
      responsive: true,
      fluid: true,
      sources: [
        {
          src: src,
          type: "video/mp4",
        },
      ],
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <video controls width="600" src={src}>
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
}
