export const startRecording = async ({
  onFinishRecording,
}: {
  onFinishRecording: (formData: FormData) => void;
}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      onFinishRecording(formData);
    };

    mediaRecorder.start();
    console.log("Recording started");

    // Stop recording after 5 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      console.log("Recording stopped");
    }, 5000);
  } catch (error) {
    console.error("Error accessing microphone:", error);
  }
};
