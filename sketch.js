let video;
let playing = false;
let circleDisplayed = false;
let currentTime = 0;
let messageElement; // HTML element for the message
let playPauseButton; // Button to play/pause video
let fillCheckbox; // Checkbox to toggle circle fill
let solidFill = false; // Track if the circle should have a solid fill

function setup() {
  createCanvas(1280, 720);

  // Create the message element below the canvas
  messageElement = createP('');
  messageElement.position(10, height + 80); // Position it below the canvas and button

  // Create Play/Pause button
  playPauseButton = createButton("Play Video");
  playPauseButton.position(10, height + 30); // Position it below the canvas
  playPauseButton.mousePressed(toggleVideo); // Attach function to handle play/pause

  // Create checkbox for circle fill toggle
  fillCheckbox = createCheckbox("Show hot spots", false);
  fillCheckbox.position(120, height + 30); // Position it next to the button
  fillCheckbox.changed(toggleCircleFill); // Attach function to handle fill toggle

  video = createVideo(['http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']);
  video.hide();

  // Resize video after metadata is loaded
  video.onloadedmetadata = function() {
    resizeVideo();
  };

  // Use .elt to access HTML video element directly
  video.elt.ontimeupdate = handleTimeUpdate;
  console.log("Setup complete");
}

function draw() {
  background(240);

  // Display instructions
  textSize(16);
  text('Click the circle to display a message below.', 150, 150);

  // Draw video frame to canvas
  image(video, 0, 0);

  // Display circle if needed
  if (circleDisplayed) {
    drawCircle();
  }
}

function resizeVideo() {
  let videoWidth = video.width;
  let videoHeight = video.height;
  let canvasRatio = width / height;
  let videoRatio = videoWidth / videoHeight;

  if (canvasRatio !== videoRatio) {
    if (canvasRatio > videoRatio) {
      video.size(width, videoHeight * (width / videoWidth));
    } else {
      video.size(videoWidth * (height / videoHeight), height);
    }
  } else {
    video.size(width, height);
  }
}

function handleTimeUpdate() {
  currentTime = video.elt.currentTime;
  console.log("Current Time:", currentTime); // Debugging output

  // Toggle circle display based on current time
  if (currentTime >= 10 && currentTime < 15 && !circleDisplayed) {
    console.log("Displaying circle");
    circleDisplayed = true;
  } else if (currentTime >= 15 && circleDisplayed) {
    console.log("Hiding circle");
    circleDisplayed = false;
  }
}

function drawCircle() {
  let circleX = width / 2;
  let circleY = height / 2;
  let circleRadius = 50;

  if (solidFill) {
    fill(255, 0, 0); // Solid red fill when checkbox is checked
    stroke(0); // Add a visible stroke if needed
  } else {
    fill(255, 0, 0, 0); // Fully transparent fill
    noStroke(); // Remove the outline when invisible
  }

  // Draw the circle (invisible when transparent and noStroke)
  ellipse(circleX, circleY, circleRadius, circleRadius);
}

function mousePressed() {
  // Check if circle is clicked
  let circleX = width / 2;
  let circleY = height / 2;
  let circleRadius = 50;
  if (circleDisplayed && dist(mouseX, mouseY, circleX, circleY) < circleRadius) {
    console.log("Circle clicked!");
    messageElement.html("Circle was clicked!"); // Update the message
  }
}

// Function to toggle video play/pause
function toggleVideo() {
  if (playing) {
    video.pause();
    playPauseButton.html("Play Video"); // Update button text
    console.log("Video paused");
  } else {
    video.loop();
    playPauseButton.html("Pause Video"); // Update button text
    console.log("Video playing");
  }
  playing = !playing;
}

// Function to toggle circle fill based on checkbox
function toggleCircleFill() {
  solidFill = fillCheckbox.checked(); // Update solidFill based on checkbox
}
