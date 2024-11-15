export class Obstacle {
  constructor(x, y, difficulty) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 40;
    this.baseSpeed = 5;
    this.speed = this.baseSpeed * difficulty;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = '#ff8c00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }
}