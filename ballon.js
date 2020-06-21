(function () {
    'use strict';
    window.addEventListener('load', function () {
      var canvas = document.getElementById('ballon');
  
      if (!canvas || !canvas.getContext) {
        return false;
      }
  
      /********************
        Random Number
      ********************/
  
      function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
  
      /********************
        Var
      ********************/
  
      var ctx = canvas.getContext('2d');
      var X = canvas.width = window.innerWidth;
      var Y = canvas.height = window.innerHeight;
      var mouseX = null;
      var mouseY = null;
      var ferrisWheels = [];
      var ferrisWheelNum = 1;
      var splitNum = 16;
      var splitAn = 360 / splitNum;
      var wheelRadius = 200;
      var baloonMax = 100;
  
      if (X < 768) {
        wheelRadius = 100;
        baloonMax = 50;
      }
  
      /********************
        Animation
      ********************/
  
      window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(cb) {
          setTimeout(cb, 17);
        };
      
      /********************
        Particle
      ********************/
      
      var particleNum = 6;
      var particles = [];
  
      if (X < 768) {
        particleNum = 3;
      }
  
      function Particle(ctx, x, y) {
        this.ctx = ctx;
        this.init(x, y);
      }
  
      Particle.prototype.init = function(x, y) {
        this.x = x;
        this.y = y;
        this.r = rand(30, baloonMax);
        this.a = rand(0, 360);
        this.rad = this.a * Math.PI / 180;
        this.v = {
          x: 0,
          y: Math.random() * 2 + 0.2,
        };
        this.c = {
          r: rand(0, 50),
          g: rand(0, 50),
          b: rand(0, 50)
        };
        this.l = this.r * 1.5;
      };
  
      Particle.prototype.draw = function() {
        var ctx = this.ctx;
        // body
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.r / 30;
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.scale(1, 1.3);
        ctx.translate(-this.x, -this.y);
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(this.x - this.r / 5 / 2, this.y + this.r - this.r / 20, this.r / 5, this.r / 10);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.r);
        ctx.quadraticCurveTo(Math.cos(this.rad) * 10 + this.x, Math.sin(this.rad) * 10 + this.y + this.r + this.l / 3, Math.cos(this.rad) * 10 + this.x, Math.sin(this.rad) * 10 + this.y + this.r + this.l);
        ctx.stroke();
        ctx.restore();
      };
  
      Particle.prototype.updateParams = function() {
        this.a += 0.5;
        this.rad = this.a * Math.PI / 180;
      };
  
      Particle.prototype.updatePosition = function() {
        this.y -= this.v.y;
      };
  
      Particle.prototype.wrapPosition = function() {
        if ((this.y + this.r + this.r + this.l) < 0) this.init(rand(0, X), Y + this.r + this.r);
      };
  
      Particle.prototype.render = function(i) {
        this.updatePosition();
        this.wrapPosition();
        this.updateParams();
        this.draw();
      };
  
      for (var i = 0; i < particleNum; i++) {
        var particle = new Particle(ctx, rand(0, X), rand(0, Y));
        particles.push(particle);
      }
  
      /********************
        Render
      ********************/
     
      function render() {
        ctx.clearRect(0, 0, X, Y);
        for (var i = 0; i < particles.length; i++) {
          particles[i].render();
        }
        requestAnimationFrame(render);
      }
  
      render();
  
      /********************
        Event
      ********************/
      
      function onResize() {
        X = canvas.width = window.innerWidth;
        Y = canvas.height = window.innerHeight;
  
        if (X < 768) {
          wheelRadius = 100;
          baloonMax = 50;
          particleNum = 3;
        } else {
          wheelRadius = 200;
          baloonMax = 100;
          particleNum = 6;
        }
        particles = [];
        for (var i = 0; i < particleNum; i++) {
          var particle = new Particle(ctx, rand(0, X / 2), rand(0, Y));
          particles.push(particle);
        }
      }
  
      window.addEventListener('resize', function(){
        onResize();
      });
      
      canvas.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
  
      canvas.addEventListener('wheel', function(e){
        
        for (var i = 0; i < particles.length; i++) {
          if (particles[i].r > 30) {
            particles[i].r += e.deltaY / 100;
            particles[i].l += e.deltaY / 100;
          }
          if (particles[i].r < 30) {
            particles[i].r -= e.deltaY / 100;
            particles[i].l -= e.deltaY / 100;
          }
        }
      });
  
      canvas.addEventListener('click', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        var particle = new Particle(ctx, mouseX, mouseY);
        particles.push(particle);
      }, false);
  
    });
    
  })();