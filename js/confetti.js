// Star & Confetti Particle Celebration Engine
// High performance canvas particle effects with zero external libraries!

class ConfettiEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'celebration-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 70, type = 'mixed') {
    const colors = [
      '#FFD700', '#FFA500', '#FF4D6D', '#70E000', 
      '#38B000', '#00B4D8', '#9D4EDD', '#FFB703', '#FFFFFF'
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      const size = Math.random() * 8 + 6;
      
      let pType = 'confetti';
      if (type === 'stars' || (type === 'mixed' && Math.random() > 0.4)) {
        pType = 'star';
      }

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 4 + 2),
        size: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        type: pType,
        gravity: 0.18,
        friction: 0.98,
        life: 0,
        maxLife: Math.random() * 60 + 80
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  // Star Celebration: 2 bursts from left and right corners
  celebrateBig() {
    this.burst(window.innerWidth * 0.2, window.innerHeight * 0.5, 60, 'mixed');
    setTimeout(() => {
      this.burst(window.innerWidth * 0.8, window.innerHeight * 0.5, 60, 'stars');
    }, 150);
    setTimeout(() => {
      this.burst(window.innerWidth * 0.5, window.innerHeight * 0.35, 90, 'stars');
    }, 350);
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  animate() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.rotation += p.rotationSpeed;

      const progress = p.life / p.maxLife;
      p.opacity = Math.max(0, 1 - progress);

      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.type === 'star') {
        this.drawStar(this.ctx, 0, 0, 5, p.size * 1.3, p.size * 0.6, p.color);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      this.ctx.restore();

      if (p.life >= p.maxLife || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.animationId = null;
    }
  }
}

window.confettiEngine = new ConfettiEngine();

