export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.initialX = x;
    this.y = y;
    this.initialY = y;
    this.width = 40;
    this.height = 40;
    this.speed = 2;
    this.targetY = y;
  }

  update(player, difficulty) {
    // Improved chase logic with delayed vertical movement
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    
    // Horizontal movement
    if (Math.abs(dx) > 100) { // Keep some distance
      this.x += Math.sign(dx) * this.speed * difficulty;
    }
    
    // Vertical movement with smoothing
    if (Math.abs(dy) > 20) {
      this.targetY = player.y;
    }
    
    // Smooth vertical movement
    const yDiff = this.targetY - this.y;
    this.y += yDiff * 0.05;

    // Keep enemy in bounds
    this.x = Math.max(0, Math.min(this.x, 800 - this.width));
    this.y = Math.max(0, Math.min(this.y, this.initialY));
  }

  draw(ctx) {
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.targetY = this.initialY;
  }
}