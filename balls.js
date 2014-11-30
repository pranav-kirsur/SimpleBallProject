(function(){
	var canvas = document.querySelector("canvas"),
		ctx = canvas.getContext("2d"),
		WIDTH = canvas.width,
		HEIGHT = canvas.height;

	// our ball object
	function Ball(radius, color, dFY){
		this.radius = radius;
		this.color = color;
		this.decreaseFactorY = 100 - dFY;
		this.x = 0; // start coordinates
		this.y = HEIGHT - 2 * this.radius;
		this.velX = 0; this.velY = 0;
		this.accX = 0; this.accY = 0;
		this.gravity = 0;
		
		this.start = function(angle, velocity){
			this.gravity = 10 / 60;
			this.angle = angle / 180 * Math.PI; // convert to radians
			this.velX = velocity * Math.cos(this.angle);
			this.velY = velocity * Math.sin(this.angle);
			this.accX = 0; // zero intially
			this.accY = 0; // TODO: set option for user to set himself
			console.log(HEIGHT);
		};
		
		this.update = function(){
			this.velY -= this.gravity;			
			
			this.x += this.velX;
			
			this.y -= this.velY;
			
			// touches right wall
			if(this.x + this.radius >= WIDTH){				
				this.x = WIDTH - this.radius;				
				this.velX *= - this.decreaseFactorY / 100;
			}
			// touches left wall
			else if(this.x - this.radius <= 0){
				this.x = this.radius;
				this.velX *= - this.decreaseFactorY / 100;
			}
			
			// touches upper wall
			if(this.y - this.radius <= 0){			
				this.velY *= - this.decreaseFactorY / 100;
				this.y = this.radius;
				if(this.velY <= 2 && this.velY >= -2) this.velY = 0;
			}
			// touches bottom wall
			else if(this.y + this.radius >= HEIGHT){				
				this.velY *= - this.decreaseFactorY / 100;
				this.y = HEIGHT - this.radius;
				
				if(this.velY <= 2 && this.velY >= -2) this.velY = 0;
			}
		};
		
		this.draw = function(){
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
	}
	
	// balls array
	var balls = [];
	
	document.querySelector("input[type='button']").onclick = function(){
		var color = gId("color").value,
			velocity = parseFloat(gId("velocity").value),
			angle = parseFloat(gId("angle").value),
			radius = parseFloat(gId("radius").value),
			dFY = parseFloat(gId("dFY").value);
			
		var ball = new Ball(radius, color, dFY);
		ball.start(angle, velocity);
		balls.push(ball);
	};
	
	setInterval(function(){
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		for(var i = 0, len = balls.length; i < len; i++){			
			balls[i].draw();
			balls[i].update();
		}
	}, 1000/60); // 1000/x depicts x fps
	
	function gId(str){
		return document.getElementById(str);
	}
})();
