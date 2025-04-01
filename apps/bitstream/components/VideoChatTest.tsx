"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const REALTIME_SERVER_URL = process.env.NEXT_REALTIME_SERVER_URL;

interface VideoCallUIProps {
  roomId?: string;
  onLeaveCall?: () => void;
}

export default function VideoCallUI({
  roomId = "test",
  onLeaveCall = () => {},
}: VideoCallUIProps) {
  console.info("REALTIME_SERVER_URL", REALTIME_SERVER_URL);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [peerConnections, setPeerConnections] = useState<
    Record<string, RTCPeerConnection>
  >({});
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [isLocalStreamReady, setIsLocalStreamReady] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Queue for storing signaling messages that arrive before the local stream is ready
  const pendingSignalingMessages = useRef<any[]>([]);

  // Initialize local media stream
  useEffect(() => {
    // Get local media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsLocalStreamReady(true);

        // Process any pending signaling messages
        if (pendingSignalingMessages.current.length > 0) {
          console.log(
            `Processing ${pendingSignalingMessages.current.length} pending messages`,
          );
          pendingSignalingMessages.current.forEach((message) => {
            handleSignalingMessage(message);
          });
          pendingSignalingMessages.current = [];
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    return () => {
      // Stop all streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Connect to the WebSocket server
  useEffect(() => {
    if (!roomId) return;

    socketRef.current = new WebSocket(
      REALTIME_SERVER_URL || "ws://localhost:3001",
    );

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);

      // Join the room
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "join",
            roomId,
          }),
        );
      }
    };

    socketRef.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onmessage = (event) => {
      // Check if the data is a Blob
      if (event.data instanceof Blob) {
        // Convert Blob to text before parsing
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const message = JSON.parse(reader.result as string);
            processIncomingMessage(message);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };
        reader.readAsText(event.data);
      } else {
        // If it's already text, parse it directly
        try {
          const message = JSON.parse(event.data);
          processIncomingMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };

    return () => {
      // Cleanup
      if (socketRef.current) {
        socketRef.current.close();
      }

      // Close all peer connections
      Object.values(peerConnections).forEach((pc) => pc.close());
    };
  }, [roomId]);

  // Process incoming messages, queue them if local stream isn't ready yet
  const processIncomingMessage = (message: any) => {
    if (!isLocalStreamReady) {
      console.log(`Local stream not ready, queueing message: ${message.type}`);
      pendingSignalingMessages.current.push(message);
      return;
    }

    handleSignalingMessage(message);
  };

  // Handle signaling messages from the WebSocket server
  const handleSignalingMessage = (message: any) => {
    console.log(`Processing message: ${message.type}`);

    switch (message.type) {
      case "user-joined":
        // A new user has joined, initialize a peer connection
        initializePeerConnection(message.userId);
        break;

      case "user-left":
        // A user has left, clean up their peer connection
        if (peerConnections[message.userId]) {
          peerConnections[message.userId].close();
          const newConnections = { ...peerConnections };
          delete newConnections[message.userId];
          setPeerConnections(newConnections);

          setConnectedPeers((prev) =>
            prev.filter((id) => id !== message.userId),
          );
        }
        break;

      case "offer":
        // Received an offer, set it as remote description and send an answer
        handleOffer(message);
        break;

      case "answer":
        // Received an answer, set it as remote description
        handleAnswer(message);
        break;

      case "ice-candidate":
        // Received an ICE candidate, add it to the peer connection
        handleIceCandidate(message);
        break;
    }
  };

  // Initialize a peer connection for a new user
  const initializePeerConnection = (userId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local tracks to the peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (localStreamRef.current) {
          pc.addTrack(track, localStreamRef.current);
        }
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
            userId,
          }),
        );
      }
    };

    // Handle remote tracks
    pc.ontrack = (event) => {
      const peerVideo = peerVideoRefs.current[userId];
      if (peerVideo) {
        peerVideo.srcObject = event.streams[0];
      }

      if (!connectedPeers.includes(userId)) {
        setConnectedPeers((prev) => [...prev, userId]);
      }
    };

    // Create and send an offer
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        if (socketRef.current && pc.localDescription) {
          socketRef.current.send(
            JSON.stringify({
              type: "offer",
              offer: pc.localDescription,
              userId,
            }),
          );
        }
      })
      .catch((error) => {
        console.error("Error creating offer:", error);
      });

    // Update peer connections
    setPeerConnections((prev) => ({
      ...prev,
      [userId]: pc,
    }));
  };

  // Handle an offer from a peer
  const handleOffer = (message: any) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local tracks to the peer connection
    console.info("localStreamRef", localStreamRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (localStreamRef.current) {
          pc.addTrack(track, localStreamRef.current);
        }
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
            userId: message.userId,
          }),
        );
      }
    };

    // Handle remote tracks
    pc.ontrack = (event) => {
      const peerVideo = peerVideoRefs.current[message.userId];
      if (peerVideo) {
        peerVideo.srcObject = event.streams[0];
        console.log(
          `Setting video for ${message.userId} to ${peerVideo.srcObject}`,
        );
      }

      if (!connectedPeers.includes(message.userId)) {
        setConnectedPeers((prev) => [...prev, message.userId]);
      }
    };

    // Set remote description and create answer
    pc.setRemoteDescription(new RTCSessionDescription(message.offer))
      .then(() => pc.createAnswer())
      .then((answer) => pc.setLocalDescription(answer))
      .then(() => {
        if (socketRef.current && pc.localDescription) {
          socketRef.current.send(
            JSON.stringify({
              type: "answer",
              answer: pc.localDescription,
              userId: message.userId,
            }),
          );
        }
      })
      .catch((error) => {
        console.error("Error handling offer:", error);
      });

    // Update peer connections
    setPeerConnections((prev) => ({
      ...prev,
      [message.userId]: pc,
    }));
  };

  // Handle an answer from a peer
  const handleAnswer = (message: any) => {
    const pc = peerConnections[message.userId];
    if (pc) {
      pc.setRemoteDescription(new RTCSessionDescription(message.answer)).catch(
        (error) => {
          console.error("Error setting remote description:", error);
        },
      );
    }
  };

  // Handle an ICE candidate from a peer
  const handleIceCandidate = (message: any) => {
    const pc = peerConnections[message.userId];
    if (pc) {
      pc.addIceCandidate(new RTCIceCandidate(message.candidate)).catch(
        (error) => {
          console.error("Error adding ICE candidate:", error);
        },
      );
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Handle leaving the call
  const handleLeaveCall = () => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "leave",
          roomId,
        }),
      );
      socketRef.current.close();
    }

    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Close all peer connections
    Object.values(peerConnections).forEach((pc) => pc.close());

    onLeaveCall();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Room: {roomId}</h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm">
            {isConnected ? "Connected" : "Disconnecting..."}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Local video */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
            You {isMuted && "(Muted)"}
          </div>
        </div>

        {/* Peer videos */}
        {connectedPeers.map((peerId, index) => (
          <div
            key={peerId + "-" + index}
            className="relative aspect-video bg-black rounded-lg overflow-hidden"
          >
            <video
              ref={(el) => {
                if (el && peerVideoRefs.current[peerId]?.srcObject)
                  el.srcObject = peerVideoRefs.current[peerId]?.srcObject;
                console.log(
                  `Setting video for ${peerId} to ${peerVideoRefs.current[peerId]}`,
                );
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
              Peer {peerId.substring(0, 6)}
            </div>
          </div>
        ))}

        {/* Placeholder for empty grid spots */}
        {Array.from({ length: Math.max(0, 2 - connectedPeers.length) }).map(
          (_, i) => (
            <div
              key={`placeholder-${i}`}
              className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center"
            >
              <p className="text-gray-400">Waiting for participants...</p>
            </div>
          ),
        )}
      </div>

      <div className="flex justify-center gap-4 py-4">
        <Button
          variant={isMuted ? "destructive" : "outline"}
          size="icon"
          onClick={toggleMute}
          className="rounded-full h-12 w-12"
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={handleLeaveCall}
          className="rounded-full h-12 w-12"
        >
          <Phone className="h-5 w-5" />
        </Button>

        <Button
          variant={isVideoOff ? "destructive" : "outline"}
          size="icon"
          onClick={toggleVideo}
          className="rounded-full h-12 w-12"
        >
          {isVideoOff ? (
            <VideoOff className="h-5 w-5" />
          ) : (
            <Video className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
