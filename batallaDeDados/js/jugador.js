// jugador.js
// Clase Jugador: representa el estado y comportamiento de cada jugador.

class Jugador {
  constructor({ id, nombre, avatar }) {
    this.id = id;                         // Identificador único del jugador
    this.nombre = nombre;                 // Nombre visible
    this.avatar = avatar ||               // Imagen del jugador (por defecto usa pravatar)
      `https://i.pravatar.cc/150?img=${10 + id}`;

    this.puntos = 0;                      // Puntos acumulados por tiradas
    this.tiradas = 0;                     // Número de tiradas realizadas
    this.rondasGanadas = 0;               // Rondas ganadas
    this.ultimoResultado = null;          // Última tirada en la ronda actual
  }

  // Registra una tirada: guarda resultado, suma puntos y aumenta contador
  registrarTirada(valor) {
    this.ultimoResultado = valor;
    this.puntos += valor;
    this.tiradas += 1;
  }

  // Suma una ronda ganada
  sumarRonda() {
    this.rondasGanadas += 1;
  }

  // Convierte la instancia a un objeto apto para JSON
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      avatar: this.avatar,
      puntos: this.puntos,
      tiradas: this.tiradas,
      rondasGanadas: this.rondasGanadas,
      ultimoResultado: this.ultimoResultado
    };
  }

  // Restaura un jugador desde un objeto JSON guardado
  static fromJSON(obj) {
    const j = new Jugador({
      id: obj.id,
      nombre: obj.nombre,
      avatar: obj.avatar
    });

    // Restauración de estadísticas
    j.puntos = obj.puntos || 0;
    j.tiradas = obj.tiradas || 0;
    j.rondasGanadas = obj.rondasGanadas || 0;
    j.ultimoResultado = obj.ultimoResultado ?? null;

    return j;
  }
}

// Exporta la clase
window.Jugador = Jugador;

