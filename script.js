<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Beautiful Princess</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: black;
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
<canvas id="canvas"></canvas>
<script>
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

const messages = [
  "Happy Birthday",
  "alaa",
  "1999.27.8",
  "Happy26",
  "My Beautiful Moon",
  "My Little Princess❤",
  "My Only Love"
];

let particles = [];
let currentMsgIndex = 0;
const delay = 2500;

function drawMatrixBackground() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FF69B4"; // وردي قوي
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = "HAPPY BIRTHDAY";
    const letter = text[Math.floor(Math.random() * text.length)];
    ctx.fillText(letter, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}

function generateTextPoints(text) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.font = "bold 80px Arial";
  tempCtx.fillStyle = "white";
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(text, centerX, centerY);

  const imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const i = (y * canvas.width + x) * 4;
      if (imgData[i + 3] > 150) points.push({ x, y });
    }
  }
  return points;
}

function generateHeartPointsWithText(text) {
  const heartPoints = [];
  const scale = 20;

  for (let t = 0; t < Math.PI * 2; t += 0.05) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    for (let i = 0; i < 3; i++) {
      heartPoints.push({
        x: centerX + (x + i * 0.5) * scale,
        y: centerY - y * scale,
      });
    }
  }

  const textPoints = generateTextPoints(text);
  return heartPoints.concat(textPoints);
}

function transitionToPoints(newTargets) {
  let maxLen = Math.max(newTargets.length, particles.length);
  const updated = [];

  for (let i = 0; i < maxLen; i++) {
    const target = newTargets[i] || { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
    const current = particles[i] || {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      color: "hotpink"
    };
    updated.push({
      x: current.x,
      y: current.y,
      targetX: target.x,
      targetY: target.y,
      color: "hotpink"
    });
  }

  particles = updated;
}

function showNextMessage() {
  if (currentMsgIndex < messages.length) {
    const points = generateTextPoints(messages[currentMsgIndex]);
    transitionToPoints(points);
    currentMsgIndex++;
    setTimeout(() => {
      showNextMessage();
    }, delay);
  } else {
    const heartWithText = generateHeartPointsWithText("My Beautiful Princess❤");
    transitionToPoints(heartWithText);
  }
}

function animate() {
  drawMatrixBackground();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let p of particles) {
    p.x += (p.targetX - p.x) * 0.1;
    p.y += (p.targetY - p.y) * 0.1;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

animate();
showNextMessage();
</script>
</body>
</html>
