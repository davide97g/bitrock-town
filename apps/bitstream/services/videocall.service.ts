export async function getMediaStream() {
  try {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } catch (error) {
    console.error("Error accessing media devices.", error);
  }
}

let peerConnection: RTCPeerConnection | null =
  ((window as any)["peerConnection"] as RTCPeerConnection) ?? null;

export async function createOffer() {
  const offer = await peerConnection?.createOffer();
  await peerConnection?.setLocalDescription(offer);
  sendToSignalingServer({ type: "offer", offer });
}

async function handleOffer(offer: RTCSessionDescriptionInit) {
  await peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection?.createAnswer();
  await peerConnection?.setLocalDescription(answer);
  sendToSignalingServer({ type: "answer", answer });
}

async function handleAnswer(answer: RTCSessionDescriptionInit) {
  await peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleIceCandidate(candidate: RTCIceCandidateInit) {
  await peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
}

const socket = new WebSocket(
  process.env.NEXT_REALTIME_SERVER_URL ?? "ws://localhost:3001",
);

socket.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    if (message.type === "offer") handleOffer(message.offer);
    if (message.type === "answer") handleAnswer(message.answer);
    if (message.type === "ice-candidate") handleIceCandidate(message.candidate);
  } catch (error) {
    console.info(event);
    console.error("Error handling message from signaling server", error);
  }
};

function sendToSignalingServer(message: any) {
  socket.send(JSON.stringify(message));
}

export function setupPeerConnection({}: {}) {
  if (peerConnection) return peerConnection;
  console.info("Setting up peer connection");
  const newPeerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Google's public STUN server
  });

  newPeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendToSignalingServer({
        type: "ice-candidate",
        candidate: event.candidate,
      });
    }
  };

  (window as any)["peerConnection"] = newPeerConnection;
  peerConnection = newPeerConnection;
  peerConnection.oniceconnectionstatechange = () => {
    console.info(
      "ICE connection state changed:",
      peerConnection?.iceConnectionState,
    );
    if (peerConnection?.iceConnectionState === "disconnected") {
      console.info("Peer connection disconnected");
      peerConnection?.close();
      peerConnection = null;
      (window as any)["peerConnection"] = null;
    }
  };
  peerConnection.ontrack = (event) => {
    console.info("Received remote stream");
    const remoteStream = event.streams[0];
    const videoElement = document.getElementById(
      "remoteVideo",
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.srcObject = remoteStream;
      videoElement.play();
    }
    console.info("Remote stream added to video element");
  };
  peerConnection.ondatachannel = (event) => {
    console.info("Data channel opened");
    const dataChannel = event.channel;
    dataChannel.onmessage = (event) => {
      console.info("Received message:", event.data);
    };
    dataChannel.onopen = () => {
      console.info("Data channel opened");
    };
    dataChannel.onclose = () => {
      console.info("Data channel closed");
    };
  };
  peerConnection.onicecandidateerror = (event) => {
    console.error("ICE candidate error:", event.errorText);
  };
  peerConnection.onnegotiationneeded = async () => {
    console.info("Negotiation needed");
    try {
      const offer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(offer);
      sendToSignalingServer({ type: "offer", offer });
    } catch (error) {
      console.error("Error during negotiation:", error);
    }
  };

  peerConnection.onconnectionstatechange = () => {
    console.info("Connection state changed:", peerConnection?.connectionState);
    if (peerConnection?.connectionState === "disconnected") {
      console.info("Peer connection disconnected");
      peerConnection?.close();
      peerConnection = null;
      (window as any)["peerConnection"] = null;
    }
  };
  peerConnection.onicegatheringstatechange = () => {
    console.info(
      "ICE gathering state changed:",
      peerConnection?.iceGatheringState,
    );
    if (peerConnection?.iceGatheringState === "complete") {
      console.info("ICE gathering complete");
    }
  };

  return peerConnection;
}
