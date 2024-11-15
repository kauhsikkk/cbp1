import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { PowerUp } from './powerUp.js';
import { Obstacle } from './obstacle.js';

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.player = new Player(50, this.canvas.height - 60);
    this.enemy = new Enemy(this.canvas.width - 50, this.canvas.height - 60);
    this.obstacles = [];
    this.powerUps = [];
    this.score = 0;
    this.gameOver = false;
    this.animationId = null;
    this.lastObstacleTime = 0;
    this.lastPowerUpTime = 0;
    this.difficulty = 1;
    
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => this.player.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.player.handleKeyUp(e));
    document.getElementById('restartButton').addEventListener('click', () => this.restart());
  }

  start() {
    this.gameLoop();
  }

  update() {
    if (this.gameOver) return;

    this.score++;
    this.difficulty = 1 + Math.floor(this.score / 500) * 0.2;
    document.getElementById('score').textContent = `Score: ${this.score}`;

    this.player.update();
    this.enemy.update(this.player, this.difficulty);

    // Spawn obstacles with increasing frequency
    const obstacleInterval = Math.max(2000 - this.difficulty * 200, 1000);
    if (Date.now() - this.lastObstacleTime > obstacleInterval) {
      this.obstacles.push(new Obstacle(
        this.canvas.width,
        this.canvas.height - 40,
        this.difficulty
      ));
      this.lastObstacleTime = Date.now();
    }

    // Spawn power-ups
    if (Date.now() - this.lastPowerUpTime > 5000) {
      this.powerUps.push(new PowerUp(
        this.canvas.width,
        Math.random() * (this.canvas.height - 150) + 50
      ));
      this.lastPowerUpTime = Date.now();
    }

    // Update and filter obstacles
    this.obstacles = this.obstacles.filter(obstacle => {
      obstacle.update();
      return !obstacle.isOffScreen();
    });

    // Update and filter power-ups
    this.powerUps = this.powerUps.filter(powerUp => {
      powerUp.update();
      return !powerUp.isCollected && !powerUp.isOffScreen();
    });

    this.checkCollisions();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw ground
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
    
    this.player.draw(this.ctx);
    this.enemy.draw(this.ctx);
    
    this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
    this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
  }

  checkCollisions() {
    if (!this.player.hasShield) {
      // Check enemy collision
      if (this.player.checkCollision(this.enemy)) {
        this.endGame();
      }

      // Check obstacle collisions
      this.obstacles.forEach(obstacle => {
        if (this.player.checkCollision(obstacle)) {
          this.endGame();
        }
      });
    }

    // Check power-up collisions
    this.powerUps.forEach(powerUp => {
      if (!powerUp.isCollected && this.player.checkCollision(powerUp)) {
        powerUp.collect(this.player);
      }
    });
  }

  gameLoop() {
    this.update();
    this.draw();
    
    if (!this.gameOver) {
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  endGame() {
    this.gameOver = true;
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('finalScore').textContent = this.score;
  }

  restart() {
    this.gameOver = false;
    this.score = 0;
    this.difficulty = 1;
    this.obstacles = [];
    this.powerUps = [];
    this.player.reset();
    this.enemy.reset();
    document.getElementById('gameOver').classList.add('hidden');
    this.start();
  }
}