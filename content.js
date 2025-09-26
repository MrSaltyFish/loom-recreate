document.addEventListener("DOMContentLoaded", () => {
  // Create a floating button on the page
  const btn = document.createElement("button");

  btn.textContent = "Start Recording";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.padding = "10px 20px";
  btn.style.background = "#ff3b30";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.cursor = "pointer";
  btn.style.zIndex = 9999;

  document.body.appendChild(btn);

  let mediaRecorder;
  let recordedChunks = [];

  // Function to start recording
  btn.onclick = async () => {
    // Ask for screen capture
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true, // optional, capture system + mic audio
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      // Combine chunks and create a download link
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      recordedChunks = [];
    };

    mediaRecorder.start();
    btn.textContent = "Stop Recording";

    // Change button behavior to stop recording
    btn.onclick = () => {
      mediaRecorder.stop();
      btn.textContent = "Start Recording";
    };
  };
});
