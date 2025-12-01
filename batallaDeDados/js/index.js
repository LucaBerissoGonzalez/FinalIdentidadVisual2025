// index.js
// Lógica principal del juego: administra Partida, persistencia y UI.

(function () {
  const STORAGE_KEY = 'batallaDeDados_state';

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parseando estado:', e);
      return null;
    }
  }

  function saveState(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  class Partida {
    constructor(state) {
      this.targetRounds = state.targetRounds || 5;
      this.currentTurn = state.currentTurn || 0;
      this.gameOver = state.gameOver || false;

      this.jugadores = (state.jugadores || []).map(j => {
        try {
          return window.Jugador && window.Jugador.fromJSON ? window.Jugador.fromJSON(j) : j;
        } catch {
          return j;
        }
      });
    }

    switchTurn() {
      this.currentTurn = 1 - this.currentTurn;
    }

    checkRoundWinner() {
      const [a, b] = this.jugadores;
      if (a.ultimoResultado == null || b.ultimoResultado == null) return null;
      if (a.ultimoResultado > b.ultimoResultado) return a;
      if (b.ultimoResultado > a.ultimoResultado) return b;
      return 'empate';
    }

    toJSON() {
      return {
        targetRounds: this.targetRounds,
        currentTurn: this.currentTurn,
        gameOver: this.gameOver,
        jugadores: this.jugadores.map(j => (j.toJSON ? j.toJSON() : j))
      };
    }

    isGameOver() {
      return this.jugadores.some(j => j.rondasGanadas >= this.targetRounds);
    }

    getWinner() {
      return this.jugadores.find(j => j.rondasGanadas >= this.targetRounds) || null;
    }
  }

  const state = loadState();
  if (!state || !state.jugadores || state.jugadores.length < 2) {
    window.location.href = 'login.html';
  }

  const partida = new Partida(state);

  partida.jugadores = partida.jugadores.map(j => {
    try {
      return window.Jugador && window.Jugador.fromJSON ? window.Jugador.fromJSON(j) : j;
    } catch {
      return j;
    }
  });

  const nameEls = [document.getElementById('name0'), document.getElementById('name1')];
  const avatarEls = [document.getElementById('avatar0'), document.getElementById('avatar1')];
  const pointsEls = [document.getElementById('points0'), document.getElementById('points1')];
  const rollsEls = [document.getElementById('rolls0'), document.getElementById('rolls1')];
  const roundsEls = [document.getElementById('rounds0'), document.getElementById('rounds1')];
  const btnRolls = [document.getElementById('btnRoll0'), document.getElementById('btnRoll1')];
  const playerCards = [document.getElementById('playerCard0'), document.getElementById('playerCard1')];

  const turnText = document.getElementById('turnText');
  const lastResult = document.getElementById('lastResult');
  const roundWinner = document.getElementById('roundWinner');
  const centralRoll = document.getElementById('centralRoll');
  const restartBtn = document.getElementById('restartBtn');
  const resetAll = document.getElementById('resetAll');
  const endControls = document.getElementById('endControls');
  const gameOverText = document.getElementById('gameOverText');

  const dado = new window.Dado('Canvas');

  function updateUI() {
    partida.jugadores.forEach((p, i) => {
      nameEls[i].textContent = p.nombre;
      avatarEls[i].src = p.avatar;
      pointsEls[i].textContent = p.puntos;
      rollsEls[i].textContent = p.tiradas;
      roundsEls[i].textContent = p.rondasGanadas;
      if (partida.currentTurn === i && !partida.gameOver) {
        playerCards[i].classList.add('player-turn');
      } else {
        playerCards[i].classList.remove('player-turn');
      }
    });

    if (partida.gameOver) {
      const winner = partida.getWinner();
      if (winner) {
        gameOverText.textContent = `${winner.nombre} ganó la partida con ${winner.rondasGanadas} rondas!`;
      } else {
        gameOverText.textContent = `Partida finalizada.`;
      }
      endControls.classList.remove('d-none');
    } else {
      endControls.classList.add('d-none');
    }

    turnText.textContent = `Turno: ${partida.jugadores[partida.currentTurn].nombre}`;
  }

  async function playerRoll(playerIndex) {
    if (partida.gameOver) return;
    if (partida.currentTurn !== playerIndex) {
      flashMessage(`${partida.jugadores[partida.currentTurn].nombre} tiene el turno.`, 'warning');
      return;
    }

    const result = await dado.rollAnimation(800);
    const player = partida.jugadores[playerIndex];
    player.registrarTirada(result);

    lastResult.textContent = `${player.nombre} tiró ${result}.`;

    saveState(partida.toJSON());

    const roundWinnerResult = partida.checkRoundWinner();

    if (roundWinnerResult) {
      if (roundWinnerResult === 'empate') {
        roundWinner.textContent = `Empate en la ronda.`;
        roundWinner.classList.remove('d-none');
      } else {
        roundWinner.textContent = `${roundWinnerResult.nombre} ¡Ganaste!`;
        roundWinner.classList.remove('d-none');
        roundWinnerResult.sumarRonda();
      }

      partida.jugadores.forEach(j => j.ultimoResultado = null);

      updateUI();
      saveState(partida.toJSON());

      if (partida.isGameOver()) {
        partida.gameOver = true;
        updateUI();
        triggerConfetti();
        saveState(partida.toJSON());
        return;
      }

      setTimeout(() => {
        roundWinner.classList.add('d-none');
        if (roundWinnerResult !== 'empate') {
          partida.currentTurn = roundWinnerResult.id;
        } else {
          partida.currentTurn = 1 - partida.currentTurn;
        }
        updateUI();
        saveState(partida.toJSON());
      }, 1400);

    } else {
      partida.switchTurn();
      updateUI();
      saveState(partida.toJSON());
    }
  }

  centralRoll.addEventListener('click', async () => {
    if (partida.gameOver) return;
    await dado.rollAnimation(700);
  });

  btnRolls.forEach((btn, i) => {
    btn.addEventListener('click', () => playerRoll(i));
  });

  restartBtn.addEventListener('click', () => {
    partida.jugadores.forEach(j => {
      j.puntos = 0;
      j.tiradas = 0;
      j.rondasGanadas = 0;
      j.ultimoResultado = null;
    });
    partida.currentTurn = 0;
    partida.gameOver = false;
    saveState(partida.toJSON());
    updateUI();
  });

  resetAll.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'login.html';
  });

  function flashMessage(text, type = 'info', duration = 1200) {
    const div = document.createElement('div');
    div.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    div.style.zIndex = 1100;
    div.textContent = text;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), duration);
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 6,
          startVelocity: 30,
          spread: 160,
          origin: { x: Math.random(), y: Math.random() * 0.6 }
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }

  updateUI();
  setInterval(() => saveState(partida.toJSON()), 2000);

  if (partida.isGameOver()) {
    partida.gameOver = true;
    updateUI();
  }
})();
