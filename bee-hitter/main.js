const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoretext = document.querySelector('.score');
const leveltext = document.querySelector('.level');
const extratext = document.querySelector('.extra');
const title = document.querySelector('h1');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const bee_size = 20;
const bee_vely = 0.2;
let bee_velx = 0;
let level = 1;
let score = 0;
let clear = false;
let gameover = false;
let extra = false;
let extra_time = 0;
let cooldown = 0;


function Bee(x, y){
    this.x = x;
    this.y = y;
    this.size = bee_size;
    this.color = "yellow";
    this.protect = false;
}

Bee.prototype.move = function(){
    this.x += bee_velx;
    this.y += bee_vely;
}

Bee.prototype.draw = function() {
    if(this.protect){
        this.color = "blue";
    }
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}
Bee.prototype.startprotection = function() {
    let i = Math.random() * 1000;
    if(i < 1){
        this.protect = true;
    }
}

Bee.prototype.check = function() {
    if(this.y + this.size >= height - 20){
        gameover = true;
    }
}

Bee.prototype.shoot = function() {
    let i = Math.random() * 1000;
    if(i < 2){
        let bullet = new Bullet(this.x, this.y + bee_size, -5, "red");
        bees_bullets.push(bullet);
    } 
}


function Bullet(x, y, speed, color){
    this.x = x;
    this.y = y;
    this.velY = speed;
    this.size = 10;
    this.color = color;
    this.exist = true;
    this.extra = false;
}

Bullet.prototype.update = function() {
    this.y -= this.velY;
    if(this.y <= 0 || this.y > height){
        this.exist = false;
    }
}

Bullet.prototype.draw = Bee.prototype.draw;

Bullet.prototype.CollisionDetect = function() {
    for (let j = 0; j < bees.length; j++) {
        const dx = this.x - bees[j].x;
        const dy = this.y - bees[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.size + bees[j].size) {
            if(!bees[j].protect || this.extra){
                bees.splice(j, 1);
                score += 100;
            }
            this.exist = false;
            break;    
        }
    }        
}

Bullet.prototype.HitShooter = function() {
    if(this.y + this.size >= height - 20){
        if(this.x + this.size >= shooter.x && this.x - this.size <= shooter.x + shooter.wid){
            gameover = true;
        }
    }
}

function Shooter(){
    this.x = width / 2;
    this.y = height - 25;
    this.velX = 20;
    this.hei = 20;
    this.wid = 40;
    this.color = "white";
}

Shooter.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.wid,this.hei);
}

Shooter.prototype.checkbound = function(){
    if ((this.x + this.wid) >= width) {
      this.x -= this.velX;
    }
  
    if (this.x <= 0) {
      this.x += this.velX;
    }    
}

Shooter.prototype.setControl = function(){
    window.addEventListener("keydown", e => {
      switch(e.key) {
        case 'a':
            this.x -= this.velX;
            break;
        case 'd':
            this.x += this.velX;
            break;
        case 'w':
            let bullet = new Bullet(this.x + this.wid / 2, height - 30, 30, "white");
            if(extra){
                bullet.extra = true;
                bullet.color = "green";
            }
            bullets.push(bullet);
            break;
        case 'q':
            if(cooldown <= 0 && level > 2){
                cooldown = 800;
                extra = true;
                extra_time = 300;
            }
          break;

      }
    },false);
  }

let shooter = new Shooter();
shooter.setControl();

let bees = [];
let bullets = [];
let bees_bullets = [];
let clear_messages = [4];
clear_messages[0] = "恭喜通關\n下一關開始敵人會進行橫向移動\n點擊確認前往下一關";
clear_messages[1] = "恭喜通關\n下一關開始敵人會生成防護罩，可按 'q' 進入強化模式發射強化子彈擊破敵人防護罩\n點擊確認前往下一關";
clear_messages[2] = "恭喜通關\n下一關開始敵人會發射子彈\n點擊確認前往下一關";
clear_messages[3] = "恭喜通關全部關卡\n點擊確認重新開始";

function addbee(){
    let interval = 2 * bee_size + 10;
    for(let i = 1; i <= 5; i++){
        let y = interval * i;
        let left = width / 2 - interval * 1.5 * (i / 2);
        for(let j = 1; j <= i; j++){
            let bee = new Bee(left + interval * j * 1.5, y);
            bees.push(bee);
        }
    }
    
}
addbee();

function speed_update(){
    for(let i = 0; i < bees.length; i++){
        if ((bees[i].x + bee_size) >= width || (bees[i].x - bee_size) <= 0) {
            bee_velx *= -1;
            break;
        }
    }
}

function level3check(){
    if(level > 2){
        
        if(cooldown > 0 && !extra){
            cooldown--;
            if(cooldown % 10 === 0)
                extratext.textContent = `強化模式冷卻中: ${cooldown / 100 } `;
        }
        else if(cooldown <= 0 && !extra){
            extratext.textContent = `強化模式: READY `;
        }
        if(extra_time > 0){
            extra_time--;
            if(extra_time % 10 === 0)
                extratext.textContent = `強化模式剩餘: ${extra_time / 100 } `;
        }
        else{
            extra = false;
        }
    }
} 

function reset(x){
    clear = false;
    gameover = false;
    bees.length = 0;
    bullets.length = 0;
    bees_bullets.length = 0;
    addbee();
    shooter.x = width / 2;
    bee_velx = 0;
    extra = false;
    extra_time = 0;
    cooldown = 0;
    scoretext.textContent = "";
    leveltext.textContent = "";
    extratext.textContent = "";

    if(level >= 4){
        x = 0;
    }
    if(x){
        level++;
    }
    else{
        score = 0;
        level = 1;
    }
    if(level > 1){
        bee_velx = 2;
    }
    
}
window.alert("按\'a'、\'d' 鍵進行移動，\'w' 鍵進行射擊\n蜜蜂落到底部遊戲結束");
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);

    speed_update();
    shooter.checkbound();
    shooter.draw();
    
    for(let i = 0; i < bullets.length; i++){
        bullets[i].draw();
        bullets[i].update();
        bullets[i].CollisionDetect();
        if(!bullets[i].exist){
            bullets.splice(i, 1);
        }
    }

    for(let i = 0; i < bees_bullets.length; i++){
        bees_bullets[i].draw();
        bees_bullets[i].update();
        bees_bullets[i].HitShooter();
        if(!bees_bullets[i].exist){
            bees_bullets.splice(i, 1);
        }

    }

    for(let i = 0; i < bees.length; i++){
        if(level > 2){
            bees[i].startprotection();
        }
        if(level > 3){
            bees[i].shoot();
        }    
        bees[i].draw();
        bees[i].move();
        bees[i].check();
    }

    if(clear){
        window.alert(clear_messages[level - 1]);
        reset(1);
    }
    if(gameover){
        window.alert("遊戲結束\n點擊確認重新開始");
        reset(0);
    }

    if(bees.length <= 0){
        clear = true;
    }
    scoretext.textContent = `score: ${score}`;
    leveltext.textContent = `Level: ${level}`;
    level3check();
    title.textContent = "打蜜蜂";

    
    requestAnimationFrame(loop);
    
}

loop();



