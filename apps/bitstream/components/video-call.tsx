"use client";

import { useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { currentUser } from "@/lib/mock-data";
import { createOffer, setupPeerConnection } from "@/services/videocall.service";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

interface VideoCallProps {
  roomId: string;
  onEndCall: () => void;
}

export default function VideoCall({ roomId, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [peerVideoStream, setPeerVideoStream] = useState<MediaStream | null>(
    null,
  );

  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!peerConnection) return;

    console.info(peerConnection);
    console.info("Peer connection established");
  }, [peerConnection, onEndCall]);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: !isVideoOff,
          audio: !isMuted,
        });
        if (!isVideoOff) setVideoStream(stream);
        setIsLoading(false);
        return stream;
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    setPeerConnection(setupPeerConnection({}));

    createOffer().then(() => {
      getMediaStream().then((localStream) =>
        localStream?.getTracks().forEach((track) => {
          return peerConnection?.addTrack(track, localStream);
        }),
      );
    });

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    // Update participant list
    const updateParticipants = async () => {
      try {
        const videoCallRef = doc(db, "videoCalls", roomId);
        await updateDoc(videoCallRef, {
          participants: arrayUnion(currentUser.id),
        });
      } catch (error) {
        console.error("Error updating participants:", error);
      }
    };

    updateParticipants();
  }, [roomId]);

  return (
    <div className="flex flex-col h-[400px] rounded-lg overflow-hidden border border-border">
      <div className="flex justify-between items-center p-2 bg-card">
        <h3 className="text-sm font-medium">Video Call</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20"
          onClick={onEndCall}
        >
          <Icons.close className="h-4 w-4 mr-1" />
          End Call
        </Button>
      </div>
      <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
        {/* Mock video call interface */}
        <div className="text-white text-center">
          <div className="mb-4">
            <Icons.video className="h-16 w-16 mx-auto mb-2 opacity-50" />
            <div className=" w-32 h-24 bg-slate-600 rounded-lg flex items-center justify-center">
              {peerVideoStream && (
                <video
                  ref={(video) => {
                    if (video && peerVideoStream) {
                      video.srcObject = peerVideoStream;
                      video.play();
                    }
                  }}
                  className=" bottom-4 right-4 w-32 h-24 bg-slate-400 rounded-lg flex items-center justify-center"
                />
              )}
            </div>
            <p className="text-sm text-slate-400">
              Connected with {currentUser.name}
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${isMuted ? "bg-red-600 text-white hover:bg-red-700" : "bg-slate-700 text-white hover:bg-slate-600"}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <Icons.close className="h-4 w-4" /> : <span>🎤</span>}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${isVideoOff ? "bg-red-600 text-white hover:bg-red-700" : "bg-slate-700 text-white hover:bg-slate-600"}`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? (
                <Icons.close className="h-4 w-4" />
              ) : (
                <Icons.video className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
              onClick={onEndCall}
            >
              <span>📞</span>
            </Button>
          </div>
        </div>

        {/* Self view */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icons.spinner className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : null}
        {videoStream && !isLoading && (
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-600 rounded-lg flex items-center justify-center">
            {!isVideoOff && (
              <video
                ref={(video) => {
                  if (video && videoStream) {
                    video.srcObject = videoStream;
                    video.play();
                  }
                }}
                muted
                className="absolute bottom-4 right-4 w-32 h-24 bg-slate-600 rounded-lg flex items-center justify-center"
              />
            )}
            <p className="text-xs text-white">You</p>
          </div>
        )}
      </div>
    </div>
  );
}
