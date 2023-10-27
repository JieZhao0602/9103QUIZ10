let song;
let fft;

let circlePos = [];
const NUM = 32;
let radius;
let velocity;

function preload() {
  song = loadSound("sample-visualisation.mp3");
}

function setup() {
  createCanvas(4 / 3 * windowHeight, windowHeight);
  colorMode(HSB, 255);

  song.loop();
  fft = new p5.FFT();

  for (let i = 0; i < NUM; i++) {
    circlePos[i] = createVector(0, 0);
  }

  background(0);
  radius = height / 4.0;
  velocity = 2.0;
}

function draw() {
  background(0, 20);
  translate(width / 2.0, height / 2.0);
  noFill();

  let spectrum = fft.analyze();
  let spectralCentroid = fft.getCentroid();

  // Adjust velocity based on spectral centroid
  velocity = map(spectralCentroid, 0, 22050, 1.5, 2.5);

  for (let i = 0; i < NUM; i++) {
    stroke(i / NUM * 255, 255, 255);

    // Use FFT to influence circle size
    let amplitude = spectrum[i];
    let curRadius = map(amplitude, 0, 256, width / 100.0, width / 4.0);

    let curVel = velocity / NUM * (i + 1);
    let curPos = circlePos[i];
    curPos.x = cos(radians(frameCount) * curVel) * radius;
    curPos.y = sin(radians(frameCount) * curVel) * radius;

    circle(curPos.x, curPos.y, curRadius);
  }
}

function keyPressed() {
  if (key === 'B' || key === 'b') {
    background(random(255), random(255), random(255));
  }
}

let lapse = 0;
function mousePressed() {
  if (millis() - lapse > 400) {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
    lapse = millis();
  }
}
