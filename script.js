const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

const messages = [
  "Happy Birthday",
  "alaa",
  "27.8.1999",
  "26+"
];

let particles = [];
let targetPoints = [];
let currentMsgIndex = 0;
const delayBetweenTexts = 3000;

function drawMatrixBackground() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#b76eff";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const letter = "HAPPY BIRTHDAY"[Math.floor(Math.random() * 14)];
    ctx.fillText(letter, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

function generateTargets(text) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.font = "bold 80px Arial";
  tempCtx.fillStyle = "white";
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(text, centerX, centerY);

  const imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  let points = [];
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const i = (y * canvas.width + x) * 4;
      if (imgData[i + 3] > 150) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function createParticles(newTargets) {
  const newParticles = [];
  for (let i = 0; i < newTargets.length; i++) {
    const target = newTargets[i];
    const existing = particles[i] || {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      color: "pink"
    };
    newParticles.push({
      x: existing.x,
      y: existing.y,
      targetX: target.x,
      targetY: target.y,
      color: existing.color
    });
  }
  particles = newParticles;
}

function createHeartWithText(textInsideHeart) {
  const heartPoints = [];
  const scale = 18;
  for (let t = 0; t < Math.PI * 2; t += 0.05) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    for (let j = 0; j < 3; j++) {
      heartPoints.push({
        x: centerX + (x + j * 0.8) * scale,
        y: centerY - y * scale
      });
    }
  }

  const textTargets = generateTargets(textInsideHeart);
  particles = heartPoints.concat(textTargets).map((p, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    targetX: p.x,
    targetY: p.y,
    color: "pink"
  }));
}

function animate() {
  drawMatrixBackground();
  for (let p of particles) {
    p.x += (p.targetX - p.x) * 0.08;
    p.y += (p.targetY - p.y) * 0.08;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(animate);
}

function showMessages() {
  if (currentMsgIndex < messages.length - 1) {
    const targets = generateTargets(messages[currentMsgIndex]);
    createParticles(targets);
    currentMsgIndex++;
    setTimeout(showMessages, delayBetweenTexts);
  } else {
    setTimeout(() => {
      createHeartWithText("My Beautiful Princess");
    }, delayBetweenTexts);
  }
}

animate();
showMessages();
setInterval(drawMatrixBackground, 33);
