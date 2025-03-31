"use client";

import { Button } from "@/components/ui/button";
import { Mic, Send, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export function AudioRecorder({ onAudioReady, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  useEffect(() => {
    if (isRecording) {
      // Start timer
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  }, [isRecording]);

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    setAudioBlob(null);
    onCancel();
  };

  // Send recorded audio
  const sendAudio = () => {
    if (audioBlob) {
      onAudioReady(audioBlob);
      setAudioBlob(null);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className="flex items-center space-x-2">
      {!isRecording && !audioBlob ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={startRecording}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Mic className="h-5 w-5" />
          <span className="sr-only">Record audio</span>
        </Button>
      ) : (
        <div className="flex items-center space-x-2 w-full">
          {isRecording ? (
            <>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <span className="animate-pulse text-red-500">●</span>
                  <span className="text-sm font-medium">
                    {formatTime(recordingDuration)}
                  </span>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full animate-pulse"
                    style={{
                      width: `${Math.min(100, recordingDuration * 2)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={stopRecording}
                className="text-gray-500 hover:text-gray-600 hover:bg-gray-50"
              >
                <Square className="h-5 w-5" />
                <span className="sr-only">Stop recording</span>
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {formatTime(recordingDuration)}
                </span>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={sendAudio}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send audio</span>
              </Button>
            </>
          )}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={cancelRecording}
            className="text-gray-500 hover:text-gray-600 hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      )}
    </div>
  );
}
