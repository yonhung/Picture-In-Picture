const videoElement = document.querySelector('video');
const button = document.querySelector('#start');
let mediaStream = null;

let isCaptured = false;

selectMediaStream();

button.addEventListener('click', async function () {
  // close picture in picture and sharing if it is captured
  if (isCaptured) {
    document.exitPictureInPicture();
    // mediaStream.getTracks().forEach(track => track.stop());
    button.textContent="START";
    isCaptured = false;
  // select a screen and show it in Picture-In-Picture
  } else {
    await videoElement.requestPictureInPicture();
    isCaptured = true;
    button.textContent = "STOP";
  }
});

// Let user chose an screen to capture
async function selectMediaStream() {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;
    // video is loaded
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    }
    return "selected";
  } catch (error) {
    console.log(error);
  }
}