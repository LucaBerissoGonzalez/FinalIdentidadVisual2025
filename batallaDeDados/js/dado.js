// Clase Dado: controla la animación en canvas y devuelve un resultado aleatorio.

class Dado {
  // --- 1. CONSTRUCTOR:
  constructor(canvasId) {
    // Busca con el Id el elemento <canvas> en el documento HTML
    this.canvas = document.getElementById(canvasId);
    // Si no encuentra el canvas, detiene el programa y lanza un error.
    if (!this.canvas) throw new Error("Canvas no encontrado: " + canvasId);
    // Obtenemos el "contexto" 2D del canvas.
    this.ctx = this.canvas.getContext('2d');
    // Guardamos las dimensiones (ancho y alto)
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }
  // --- 2. MÉTODO DE DIBUJO: Una Cara del dado.
  drawFace(value) {
    const ctx = this.ctx;
    //inicializa el canvas todo  en 0.
    ctx.clearRect(0, 0, this.w, this.h);

    // fondo y borde
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.w, this.h);

    // pips
    const r = Math.min(this.w, this.h) / 12;
    const cx = this.w / 2;
    const cy = this.h / 2;
    const off = this.w / 4;

    ctx.fillStyle = '#111';
    const drawDot = (x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const positions = {
      1: [[cx, cy]],
      2: [[cx - off, cy - off], [cx + off, cy + off]],
      3: [[cx - off, cy - off], [cx, cy], [cx + off, cy + off]],
      4: [[cx - off, cy - off], [cx + off, cy - off], [cx - off, cy + off], [cx + off, cy + off]],
      5: [[cx - off, cy - off], [cx + off, cy - off], [cx, cy], [cx - off, cy + off], [cx + off, cy + off]],
      6: [[cx - off, cy - off], [cx, cy - off], [cx + off, cy - off], [cx - off, cy + off], [cx, cy + off], [cx + off, cy + off]]
    };

    (positions[value] || []).forEach(p => drawDot(p[0], p[1]));
  }

  async rollAnimation(duration = 900) {
    const start = performance.now();
    const end = start + duration;
    let last = 1;
    while (performance.now() < end) {
      last = Math.floor(Math.random() * 6) + 1;
      this.drawFace(last);
      await this._sleep(60);
    }
    const final = Math.floor(Math.random() * 6) + 1;
    this.drawFace(final);
    return final;
  }

  _sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
}

window.Dado = Dado;
