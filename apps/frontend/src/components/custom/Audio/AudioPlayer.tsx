"use client";

import { useGetAudioMessage } from "@/api/chat/useGetAudioMessage";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  audioId: string;
  small?: boolean;
}

function calculateAudioDuration(contentLength: number, bitrateKbps: number) {
  const bits = contentLength * 8; // Converti i byte in bit
  const bitrate = bitrateKbps * 1000; // Converti kbps in bps
  return bits / bitrate; // Durata in secondi
}

const bitrateKbps = 128;

export function AudioPlayer({ audioId, small = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioMessage = useGetAudioMessage({
    id: audioId,
  });

  useEffect(() => {
    if (!audioMessage.data) return;
    fetch(audioMessage.data, {
      method: "HEAD",
    })
      .then((response) => {
        response.headers.get("Content-Length");
        const contentLength = parseInt(
          response.headers.get("Content-Length") || "0",
          10,
        );
        // Calcola la durata dell'audio in secondi
        const duration = calculateAudioDuration(contentLength, bitrateKbps);
        setDuration(duration);
      })
      .catch((error) => {
        console.error("Error fetching audio:", error);
      });
  }, [audioMessage.data]);

  // Initialize audio element
  useEffect(() => {
    if (!audioMessage.data && isVisible) return;

    const audioUrl = audioMessage.data;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Clean up on unmount
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("timeupdate", () => {});
      audio.removeEventListener("ended", () => {});
    };
  }, [audioMessage.data, isVisible]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;

    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format time in mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // TODO: make it work

  // write an useeffect that sets the isVisible to true when the audio component is visible on screen
  useEffect(() => {
    const handleScroll = () => {
      const rect = audioRef.current?.getBoundingClientRect();
      if (rect) {
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        setIsVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check visibility on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`flex items-center ${small ? "space-x-2" : "space-x-3"}`}>
      <Button
        type="button"
        size={small ? "sm" : "icon"}
        variant="secondary"
        onClick={togglePlayPause}
        className={`rounded-full ${small ? "h-7 w-7 p-0" : ""}`}
      >
        {isPlaying ? (
          <Pause className={small ? "h-3 w-3" : "h-5 w-5"} />
        ) : (
          <Play className={small ? "h-3 w-3" : "h-5 w-5"} />
        )}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
      </Button>

      <div className="flex-1 flex flex-col">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSliderChange}
          className={small ? "h-1" : ""}
          color="primary"
        />

        <div className="flex justify-between mt-1 gap-2 w-32">
          <span
            className={`text-xs text-gray-500 ${small ? "text-[10px]" : ""}`}
          >
            {formatTime(currentTime)}
          </span>
          <span
            className={`text-xs text-gray-500 ${small ? "text-[10px]" : ""}`}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
