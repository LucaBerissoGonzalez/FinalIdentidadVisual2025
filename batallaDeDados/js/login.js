// login.js
// Maneja el formulario de login y crea el estado inicial de la partida.

(function () {
  const form = document.getElementById('loginForm');
  if (!form) return; 

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que recargue la página

    // Obtiene los nombres de los jugadores
    const p1 = document.getElementById('player1').value.trim();
    const p2 = document.getElementById('player2').value.trim();

    let valid = true;

    // Validación simple de campos vacíos
    if (!p1) {
      document.getElementById('player1').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('player1').classList.remove('is-invalid');
    }

    if (!p2) {
      document.getElementById('player2').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('player2').classList.remove('is-invalid');
    }

    if (!valid) return; 

    // Crea el estado inicial para iniciar la partida
    const initialState = {
      jugadores: [
        {
          id: 0,
          nombre: p1,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
        },
        {
          id: 1,
          nombre: p2,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
        }
      ],
      currentTurn: 0,   // Comienza jugador 0
      targetRounds: 5,  // Rondas necesarias para ganar la partida
      gameOver: false
    };

    // Guarda el estado en localStorage para usarlo en index.html
    localStorage.setItem('batallaDeDados_state', JSON.stringify(initialState));

    // Redirige al juego
    window.location.href = 'index.html';
  });
})();

