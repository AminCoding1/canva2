const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

// global settings
ctx.fillStyle = 'green';

ctx.lineWidth = 10;
ctx.lineCap = 'round';

ctx.shadowOffsetX = '4';
ctx.shadowOffsetY = '4';
ctx.shadowColor = 'black';
//ctx.strokeStyle = pattern1;

const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient1.addColorStop(0.2, 'red');
gradient1.addColorStop(0.5, 'green');
gradient1.addColorStop(0.8, 'blue');
ctx.strokeStyle = gradient1;

class Particle {
  constructor(effect){
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [];
    this.maxLength = Math.floor(Math.random() * 160 + 20);
    this.lifeSpan = this.maxLength * 2;
    this.timer = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.angle = 0;
    this.va = Math.random() * 0.5 - 0.25;
    this.speedModifier = Math.random() * 2;
    this.curve = Math.random() * 6 - 3;
    this.vc = Math.random() * 0.4 - 0.2;
    this.lineWidth = Math.floor(Math.random() * 20 + 0.1);
    this.readyToReset = false;
    this.hue = Math.floor(Math.random() * 360);
  }
  update() {
    if (this.timer < this.lifeSpan){
      // move particle in a direction
      this.x += this.speedX;
      this.y += this.speedY;
      // update particle position
      this.speedX = this.speedModifier * Math.cos(this.angle) * this.curve;
      this.speedY = this.speedModifier * Math.sin(this.angle) * this.curve;
            // if longer than max length, remove the oldest segment
            if (this.history.length > this.maxLength) {
          this.history.length = this.maxLength;
          this.history.shift();
        } else {
        // add current particle position into history array
        this.history.push({ x: this.x, y: this.y });
        }


        this.timer++;
    } else if (this.history.length >=2){
      this.history.shift();
    } else {
      this.readyToReset = true;
    }
    if (this.history.length > this.maxLength) {
      this.va *= -1.12;
      this.vc *= -1;
    } else {
      this.curve += this.vc;
      this.angle += this.va;
      this.hue++;
    }
    if (this.readyToReset) this.reset();
    // symmetry or chaos, how about both 
  }
  reset(){
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [];
    this.timer = 0;
    this.angle = 0;
    this.hue = Math.floor(Math.random() * 360);
    this.curve = Math.random() * 6 - 3;
    this.va = Math.random() * 0.5 - 0.25;
    this.vc = Math.random() * 0.4 - 0.2;
    this.readyToReset = false;
  }
  draw(context){
    if (this.history.length > 0){
      context.save();
      context.lineWidth = this.lineWidth;
      context.strokeStyle = 'hsl(' + this.hue + ', 100%, 50%)';
      context.beginPath();
      context.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 0; i < this.history.length; i++) {
        context.lineTo(this.history[i].x, this.history[i].y);
      }
      context.stroke();
      context.restore();
    }
  }
}

class Effect {
  constructor(canvas){
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 60;
  }
  init(){
    // create particles
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
    //console.log(this.particles, this);
  }
  render(context){
    context.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });
    }
}

const effect = new Effect(canvas);
//console.log(effect)
effect.init();
effect.render(ctx)

function animate(){    
  effect.render(ctx);
  requestAnimationFrame(animate);
}
animate();