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
  "27.8.1999",
  "Happy26",
  "My Beautiful Moon",
  "My Little Princess❤",
  "My Only Love"
];

let particles = [];
let currentMsgIndex = 0;
const delayBetweenTexts = 3000;
let heartShown = false;

function drawMatrixBackground() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FF69B4";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = "HAPPY BIRTHDAY";
    const letter = text[Math.floor(Math.random() * text.length)];
    ctx.fillText(letter, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

function createTextParticles(text) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.font = "bold 70px Arial";
  tempCtx.fillStyle = "white";
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(text, centerX, centerY);

  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);

  let targetPoints = [];
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const i = (y * canvas.width + x) * 4;
      if (imageData.data[i + 3] > 150) {
        targetPoints.push({ x, y });
      }
    }
  }

  particles = targetPoints.map((p, i) => ({
    x: particles[i]?.x ?? Math.random() * canvas.width,
    y: particles[i]?.y ?? Math.random() * canvas.height,
    targetX: p.x,
    targetY: p.y,
    color: "pink"
  }));
}

function createHeartShapeWithText(text) {
  const heartPoints = [];
  const scale = 20;

  for (let t = 0; t < Math.PI * 2; t += 0.07) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    for (let i = -1; i <= 1; i++) {
      heartPoints.push({
        x: centerX + (x + i * 0.5) * scale,
        y: centerY - y * scale
      });
    }
  }

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.font = "bold 50px Arial";
  tempCtx.fillStyle = "white";
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.fillText(text, centerX, centerY);

  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  const textPoints = [];
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const i = (y * canvas.width + x) * 4;
      if (imageData.data[i + 3] > 150) {
        textPoints.push({ x, y });
      }
    }
  }

  const combined = heartPoints.concat(textPoints);

  particles = combined.map((p, i) => ({
    x: particles[i]?.x ?? Math.random() * canvas.width,
    y: particles[i]?.y ?? Math.random() * canvas.height,
    targetX: p.x,
    targetY: p.y,
    color: "hotpink"
  }));
}

function animate() {
  drawMatrixBackground();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let p of particles) {
    p.x += (p.targetX - p.x) * 0.08;
    p.y += (p.targetY - p.y) * 0.08;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

function showMessagesSequentially() {
  if (currentMsgIndex < messages.length) {
    createTextParticles(messages[currentMsgIndex]);
    currentMsgIndex++;
    setTimeout(showMessagesSequentially, 4000);
  } else if (!heartShown) {
    heartShown = true;
    setTimeout(() => {
      createHeartShapeWithText("My Beautiful Princess❤");
    }, 4000);
  }
}

// Add touch support to display 5 "I LOVE YOU" on touch
window.addEventListener("touchstart", () => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      createTextParticles("I LOVE YOU");
    }, i * 500);
  }
});

animate();
showMessagesSequentially();
