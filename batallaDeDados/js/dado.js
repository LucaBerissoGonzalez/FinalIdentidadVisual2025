// Clase Dado: controla el dibujo y la animación de un dado en un <canvas>.
class Dado {

  constructor(canvasId) {
    // Obtiene el canvas por ID
    this.canvas = document.getElementById(canvasId);
    // Si no existe, detiene con error
    if (!this.canvas) throw new Error("Canvas no encontrado: " + canvasId);

    // Contexto 2D para dibujar
    this.ctx = this.canvas.getContext('2d');

    // Dimensiones del canvas
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  // --- DIBUJA UNA CARA DEL DADO ---
  drawFace(value) {
    const ctx = this.ctx;

    // Limpia el canvas
    ctx.clearRect(0, 0, this.w, this.h);

    // Dibuja fondo blanco y borde
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.w, this.h);

    // Parámetros de los puntos (pips)
    const r = Math.min(this.w, this.h) / 12;  // radio de punto
    const cx = this.w / 2;                    // centro X
    const cy = this.h / 2;                    // centro Y
    const off = this.w / 4;                   // desplazamiento desde el centro

    ctx.fillStyle = '#111';

    // Función para dibujar un punto
    const drawDot = (x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    // Posiciones de los puntos para cada cara
    const positions = {
      1: [[cx, cy]],
      2: [[cx - off, cy - off], [cx + off, cy + off]],
      3: [[cx - off, cy - off], [cx, cy], [cx + off, cy + off]],
      4: [[cx - off, cy - off], [cx + off, cy - off], [cx - off, cy + off], [cx + off, cy + off]],
      5: [[cx - off, cy - off], [cx + off, cy - off], [cx, cy], [cx - off, cy + off], [cx + off, cy + off]],
      6: [[cx - off, cy - off], [cx, cy - off], [cx + off, cy - off], [cx - off, cy + off], [cx, cy + off], [cx + off, cy + off]]
    };

    // Dibuja cada punto de la cara solicitada
    (positions[value] || []).forEach(([x, y]) => drawDot(x, y));
  }

  // --- ANIMACIÓN DEL DADO ---
  async rollAnimation(duration = 900) {
    const start = performance.now();
    const end = start + duration;
    let last = 1;

    // Bucle de animación
    while (performance.now() < end) {
      last = Math.floor(Math.random() * 6) + 1;  // número aleatorio 1-6
      this.drawFace(last);                       // dibuja la cara
      await this._sleep(60);                     // pausa para crear la animación
    }

    // Resultado final del dado
    const final = Math.floor(Math.random() * 6) + 1;
    this.drawFace(final);

    return final;
  }

  // --- PAUSA ASINC ---
  _sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
}

// Exporta la clase
window.Dado = Dado;
