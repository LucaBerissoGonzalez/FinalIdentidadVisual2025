// jugador.js
// Clase Jugador: almacena estado por jugador y métodos sencillos.
// Usamos la sintaxis ES6+ con getters/setters.

class Jugador {
  constructor({ id, nombre, avatar }) {
    this.id = id;
    this.nombre = nombre;
    this.avatar = avatar || `https://i.pravatar.cc/150?img=${10 + id}`;
    this.puntos = 0;
    this.tiradas = 0;
    this.rondasGanadas = 0;
    this.ultimoResultado = null;
  }

  registrarTirada(valor) {
    this.ultimoResultado = valor;
    this.puntos += valor;
    this.tiradas += 1;
  }

  sumarRonda() {
    this.rondasGanadas += 1;
  }

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

  static fromJSON(obj) {
    const j = new Jugador({ id: obj.id, nombre: obj.nombre, avatar: obj.avatar });
    j.puntos = obj.puntos || 0;
    j.tiradas = obj.tiradas || 0;
    j.rondasGanadas = obj.rondasGanadas || 0;
    j.ultimoResultado = obj.ultimoResultado ?? null;
    return j;
  }
}

// Hacemos la clase accesible globalmente
window.Jugador = Jugador;
