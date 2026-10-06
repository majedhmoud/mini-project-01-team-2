import { useEffect, useState } from "react";
import musicUrl from "../music/music.m4a";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audio) return;

    audio.volume = 0.6;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [audio]);

  async function togglePlayback() {
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  return (
    <>
      <audio ref={setAudio} src={musicUrl} loop preload="auto" />
      <button
        type="button"
        className="action-button music-toggle-button"
        onClick={togglePlayback}
        aria-label={
          isPlaying ? "Pause background music" : "Play background music"
        }
      >
        {isPlaying ? "Pause music" : "Play music"}
      </button>
    </>
  );
}
