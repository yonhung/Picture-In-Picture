const videoElement = document.querySelector("video");
const buttonStart = document.querySelector("#start");
const buttonSelect = document.querySelector("#chose");
let isSelected = false;

buttonSelect.addEventListener("click", function () {
  selectMediaStream()
    .then((finished) => {
      if (finished) {
        videoElement.play();

        // Check if picture-in-picture mode is available
        if (document.pictureInPictureEnabled) {
          buttonSelect.parentNode.hidden = true;
          buttonStart.parentNode.hidden = false;
          buttonStart.addEventListener("click", enterPictureInPicture);
        } else {
          buttonSelect.parentNode.hidden = true;
          videoElement.hidden = false;
        }
      }
    })
    .catch((error) =>
      console.log("An error occurs in selectMediaStream --- " + error)
    );
});

/*
  =================================
  Enter the Picture-In-Picture Mode
  =================================
*/
async function enterPictureInPicture() {
  // close picture in picture and sharing if it is captured
  if (isSelected) {
    document.exitPictureInPicture();
    buttonStart.textContent = "START";
    isSelected = false;
    // select a screen and show it in Picture-In-Picture
  } else {
    try {
      await videoElement.requestPictureInPicture();
      isSelected = true;
      buttonStart.textContent = "STOP";
    } catch (error) {
      console.log("Requet Picture In Picture Error: " + error);
    }
  }
}

/*
  ===========================================
  Let user select an screen to capture,
  return a promise after the screen is loaded
  ===========================================
*/
function selectMediaStream() {
  buttonSelect.disabled = true;
  let mediaStreamPromise = navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  });
  return mediaStreamPromise
    .then((mediaStream) => (videoElement.srcObject = mediaStream))
    .then(
      () =>
        new Promise((resovle) => {
          videoElement.onloadedmetadata = () => resovle(true);
        })
    )
    .catch((error) => console.log("getDisplayMedia Error: " + error));
}
