// login.js
// Controla el formulario de login y guarda dos jugadores en localStorage.

(function () {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = document.getElementById('player1').value.trim();
    const p2 = document.getElementById('player2').value.trim();

    let valid = true;
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

    const initialState = {
      jugadores: [
        { id: 0, nombre: p1, avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}` },
        { id: 1, nombre: p2, avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}` }
      ],
      currentTurn: 0,
      targetRounds: 5,
      gameOver: false
    };

    localStorage.setItem('batallaDeDados_state', JSON.stringify(initialState));
    window.location.href = 'index.html';
  });
})();
