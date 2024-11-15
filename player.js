export class Player {
  constructor(x, y) {
    this.x = x;
    this.initialX = x;
    this.y = y;
    this.initialY = y;
    this.width = 40;
    this.height = 40;
    this.velocityY = 0;
    this.jumping = false;
    this.speed = 5;
    this.hasShield = false;
    
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    };
  }

  handleKeyDown(e) {
    if (this.keys.hasOwnProperty(e.key)) {
      this.keys[e.key] = true;
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    if (this.keys.hasOwnProperty(e.key)) {
      this.keys[e.key] = false;
      e.preventDefault();
    }
  }

  update() {
    // Jumping
    if (this.keys.ArrowUp && !this.jumping) {
      this.velocityY = -15;
      this.jumping = true;
    }

    // Apply gravity
    this.velocityY += 0.8;
    this.y += this.velocityY;

    // Ground collision
    if (this.y > this.initialY) {
      this.y = this.initialY;
      this.velocityY = 0;
      this.jumping = false;
    }

    // Horizontal movement with smoother controls
    if (this.keys.ArrowLeft) this.x -= this.speed;
    if (this.keys.ArrowRight) this.x += this.speed;

    // Keep player in bounds but allow more movement space
    this.x = Math.max(0, Math.min(this.x, 800 - this.width));
  }

  draw(ctx) {
    // Draw player with shield effect
    if (this.hasShield) {
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, 
              this.width/1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fill();
    }
    
    ctx.fillStyle = this.hasShield ? '#00ff00' : '#ff0000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(entity) {
    return (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    );
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.velocityY = 0;
    this.jumping = false;
    this.hasShield = false;
  }
}