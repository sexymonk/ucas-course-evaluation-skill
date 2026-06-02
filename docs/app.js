const canvas = document.querySelector("#flow-field");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let width = 0;
let height = 0;
let nodes = [];
let raf = 0;

function resize() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  seedNodes();
}

function seedNodes() {
  const count = Math.max(42, Math.floor((width * height) / 32000));
  nodes = Array.from({ length: count }, (_, index) => {
    const band = index % 3;
    return {
      x: (width * (band + 0.5)) / 3 + (Math.random() - 0.5) * width * 0.18,
      y: Math.random() * height,
      vx: 0.16 + Math.random() * 0.42,
      vy: (Math.random() - 0.5) * 0.18,
      r: 1.6 + Math.random() * 2.4,
      hue: band === 0 ? 194 : band === 1 ? 139 : 42,
      phase: Math.random() * Math.PI * 2,
    };
  });
}

function draw(time = 0) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(6, 8, 11, 0.22)";
  ctx.fillRect(0, 0, width, height);

  drawGrid(time);
  drawLinks();
  drawNodes(time);

  if (!prefersReducedMotion.matches) {
    raf = window.requestAnimationFrame(draw);
  }
}

function drawGrid(time) {
  const spacing = 48;
  const drift = (time * 0.014) % spacing;
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#d7f6ff";
  ctx.lineWidth = 1;

  for (let x = -spacing + drift; x < width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + width * 0.08, height);
    ctx.stroke();
  }

  for (let y = -spacing; y < height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + drift);
    ctx.lineTo(width, y - height * 0.06 + drift);
    ctx.stroke();
  }

  ctx.restore();
}

function drawLinks() {
  ctx.save();
  ctx.lineWidth = 1;

  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j += 1) {
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 150) {
        const alpha = 1 - distance / 150;
        ctx.strokeStyle = `rgba(150, 230, 255, ${alpha * 0.28})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

function drawNodes(time) {
  for (const node of nodes) {
    if (!prefersReducedMotion.matches) {
      node.x += node.vx;
      node.y += node.vy + Math.sin(time * 0.0012 + node.phase) * 0.12;
      if (node.x > width + 24) node.x = -24;
      if (node.y < -24) node.y = height + 24;
      if (node.y > height + 24) node.y = -24;
    }

    const pulse = 0.5 + Math.sin(time * 0.002 + node.phase) * 0.5;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${node.hue}, 95%, 72%, ${0.42 + pulse * 0.38})`;
    ctx.arc(node.x, node.y, node.r + pulse * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

resize();
window.addEventListener("resize", resize);
prefersReducedMotion.addEventListener("change", () => {
  window.cancelAnimationFrame(raf);
  draw();
});
draw();
