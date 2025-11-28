if (!window.__snakeInitialized) {
  window.__snakeInitialized = true;

  window.addEventListener('load', function () {
    const canvas = document.getElementById("canvas");
    if (!canvas) { console.error('#canvas not found'); return; }
    const ctx = canvas.getContext("2d");

    const btnStart = document.getElementById('btnStart');
    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');
    const selSpeed = document.getElementById('selSpeed');
    const scoreEl = document.getElementById('score');
    const statusEl = document.getElementById('status');

    const BLOCK_SIZE = 20;
    const MAP_SIZE = Math.floor(canvas.width / BLOCK_SIZE);

    let score = 0;
    let timer = null;
    let speed = Number(selSpeed.value) || 120;
    let running = false;
    let gameOver = false;

    function makeInitialBody(x, y, len) {
      const arr = [];
      for (let i = 0; i < len; i++) arr.push({ x: x, y: y + i });
      return arr;
    }

    const snake = {
      size: 5,
      direction: { x: 0, y: -1 },
      body: makeInitialBody(Math.floor(MAP_SIZE / 2), Math.floor(MAP_SIZE / 2), 5),

      // Draw as overlapping circles to appear continuous (smooth)
      draw: function () {
        const radius = BLOCK_SIZE / 2;
        ctx.fillStyle = 'lime';
        ctx.beginPath();
        for (let i = 0; i < this.body.length; i++) {
          const cx = this.body[i].x * BLOCK_SIZE + radius;
          const cy = this.body[i].y * BLOCK_SIZE + radius;
          ctx.moveTo(cx + radius, cy);
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        }
        ctx.fill();
        // draw head highlight
        const head = this.body[0];
        const hx = head.x * BLOCK_SIZE + radius;
        const hy = head.y * BLOCK_SIZE + radius;
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(hx, hy, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      },

      move: function () {
        const newHead = {
          x: this.body[0].x + this.direction.x,
          y: this.body[0].y + this.direction.y
        };
        this.body.unshift(newHead);
        while (this.body.length > this.size) this.body.pop();
      },

      reset: function () {
        this.size = 5;
        this.direction = { x: 0, y: -1 };
        this.body = makeInitialBody(Math.floor(MAP_SIZE / 2), Math.floor(MAP_SIZE / 2), this.size);
      }
    };

    const apple = {
      x: 5, y: 5,
      draw: function () {
        ctx.fillStyle = 'red';
        // draw small rounded apple so it sits nicely with circular snake
        const r = BLOCK_SIZE * 0.4;
        const cx = this.x * BLOCK_SIZE + BLOCK_SIZE / 2;
        const cy = this.y * BLOCK_SIZE + BLOCK_SIZE / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      },
      place: function () {
        let px, py, collision;
        do {
          px = Math.floor(Math.random() * MAP_SIZE);
          py = Math.floor(Math.random() * MAP_SIZE);
          collision = snake.body.some(b => b.x === px && b.y === py);
        } while (collision);
        this.x = px; this.y = py;
      }
    };

    function drawMap() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function eatApple() {
      if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
        snake.size += 1;
        score++;
        updateScore();
        apple.place();
      }
    }

    function updateScore() { scoreEl.textContent = 'Score: ' + score; }
    function setStatus(t) { statusEl.textContent = t; }

    function checkDeath() {
      const head = snake.body[0];
      if (head.x < 0 || head.x >= MAP_SIZE || head.y < 0 || head.y >= MAP_SIZE) return true;
      for (let i = 1; i < snake.body.length; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) return true;
      }
      return false;
    }

    function render() {
      drawMap();
      apple.draw();
      snake.draw();
    }

    function gameStep() {
      snake.move();
      if (checkDeath()) { onGameOver(); render(); return; }
      eatApple();
      render();
    }

    function startGame() {
      if (gameOver) resetGame();
      if (running) return;
      if (timer) clearInterval(timer);
      timer = setInterval(gameStep, speed);
      running = true;
      setStatus('Running');
      updateButtons();
    }

    function pauseGame() {
      if (timer) { clearInterval(timer); timer = null; }
      running = false;
      if (!gameOver) setStatus('Paused');
      updateButtons();
    }

    function resetGame() {
      pauseGame();
      score = 0; updateScore();
      gameOver = false;
      snake.reset();
      apple.place();
      render();
      setStatus('Ready');
      updateButtons();
    }

    function onGameOver() {
      pauseGame();
      gameOver = true;
      setStatus('Game Over');
      updateButtons();
    }

    function changeSpeed(val) {
      speed = Number(val) || speed;
      if (running) { pauseGame(); startGame(); }
    }

    function keyDown(e) {
      const code = e.keyCode;
      if ([37,38,39,40].includes(code)) e.preventDefault();
      if (code === 38 || code === 87) { if (snake.direction.y !== 1) snake.direction = { x: 0, y: -1 }; }
      else if (code === 40 || code === 83) { if (snake.direction.y !== -1) snake.direction = { x: 0, y: 1 }; }
      else if (code === 37 || code === 65) { if (snake.direction.x !== 1) snake.direction = { x: -1, y: 0 }; }
      else if (code === 39 || code === 68) { if (snake.direction.x !== -1) snake.direction = { x: 1, y: 0 }; }
      else if (code === 32) { e.preventDefault(); running ? pauseGame() : startGame(); }
    }

    function updateButtons() {
      btnStart.disabled = running;
      btnPause.disabled = !running;
      btnReset.disabled = false;
    }

    // bind UI
    btnStart.addEventListener('click', startGame);
    btnPause.addEventListener('click', pauseGame);
    btnReset.addEventListener('click', resetGame);
    selSpeed.addEventListener('change', (e) => changeSpeed(e.target.value));
    document.addEventListener('keydown', keyDown);

    // init
    resetGame();
  });
}
