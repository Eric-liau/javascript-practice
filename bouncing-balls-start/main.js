// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const text = document.querySelector('p');
const title = document.querySelector('h1');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

function shape(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
}

shape.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;

}

shape.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
        const collisionAngle = Math.atan2(dy, dx);
        const speed = Math.sqrt(this.velX * this.velX + this.velY * this.velY)
        this.velX = Math.cos(collisionAngle) * speed;
        this.velY = Math.sin(collisionAngle) * speed;
      }
    }  
  }
}

/*shape.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if(balls[j].exists){
      if (this !== balls[j]) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = randomColor();
          const collisionAngle = Math.atan2(dy, dx);
          const speed = Math.sqrt(this.velX * this.velX + this.velY * this.velY)
          this.velX = Math.cos(collisionAngle) * speed;
          this.velY = Math.sin(collisionAngle) * speed;
        }
      }
    }
  }
}*/

function Ball(x, y, velX, velY, color, size) {
  shape.call(this, x, y, velX, velY);
  this.color = color;
  this.size = size;
  this.exists = true;
}

Ball.prototype = Object.create(shape.prototype);

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

function Evilcircle(x, y){
  shape.call(this, x, y, 20, 20);
  this.size = 10;
  this.color = "white";
}
Evilcircle.prototype.draw = function(){
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}
Evilcircle.prototype.checkbound = function(){
  if ((this.x + this.size) >= width) {
    this.X -= this.velX;
  }

  if ((this.x - this.size) <= 0) {
    this.X += this.velX;
  }

  if ((this.y + this.size) >= height) {
    this.velY -= this.velY;
  }

  if ((this.y - this.size) <= 0) {
    this.velY += this.velY;
  }
}

Evilcircle.prototype.setControl = function(){
  window.addEventListener("keydown", e => {
    switch(e.key) {
      case 'w':
        this.y -= this.velY;
        break;
      case 'a':
        this.x -= this.velX;
        break;
      case 's':
        this.y += this.velY;
        break;
      case 'd':
        this.x += this.velX;
        break;
    }
  },false);
}

Evilcircle.prototype.collisionDetect = function(){
  for (let j = 0; j < balls.length; j++) { 
    const dx = this.x - balls[j].x;
    const dy = this.y - balls[j].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.size + balls[j].size) {
      balls.splice(j, 1);
    }
  }
}

/*Evilcircle.prototype.collisionDetect = function(){
  for (let j = 0; j < balls.length; j++) {
    if(balls[j].exists){
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        num--;
      }
  }
  }
}*/

function addball(){
  let size = random(10, 20);
    let ball = new Ball(
      // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomColor(),
      size
    );
    balls.push(ball);
}

let balls = [];
while (balls.length < 25) {
    addball();
}
let circle = new Evilcircle(width / 2, height / 2);
circle.setControl();

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  circle.collisionDetect();
  circle.draw();
  check();

  text.textContent = `還剩 ${balls.length} 個球`;
  title.textContent = "彈跳彩球";
  requestAnimationFrame(loop);
}

let count = 0;
function check(){
  if(count >= 100){
    count = 0;
    addball();
    return;
  }
  count++;
}
loop();