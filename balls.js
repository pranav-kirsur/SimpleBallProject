//TODO:
// 1: Add time counter
// 2: Pause the system at a point (time is 60, ballX is at pos something)

(function(){
	var canvas = document.querySelector("canvas"),
		ctx = canvas.getContext("2d"),
		WIDTH = canvas.width,
		HEIGHT = canvas.height,
		ballListTable = document.querySelector("table tbody"),
		drawFlag = true,
		FPS = 60;

	///////////////////
	// Helper functions
	///////////////////

	function gId(str){
		return document.getElementById(str);
	}

	function text(elm, str){
		if(str === void 0)
			return elm.innerText || elm.innerHTML;
		else{
			elm.innerHTML = str;
			return elm;
		}
	}
		
	// our ball object
	function Ball(radius, color, energyLoss, arrIndex){
		this.radius = radius;
		this.color = color;
		this.energyChangeFactor = 100 - energyLoss;
		this.x = 0; // start coordinates
		this.y = HEIGHT - 2 * this.radius;
		this.gravity = 0;
		this.arrIndex = arrIndex; // ball object index inside balls array

		this.start = function(angle, velocity){
			this.gravity = 10 / FPS;
			this.angle = angle / 180 * Math.PI; // convert to radians
			this.velX = (velocity * Math.cos(this.angle)).toFixed(3);
			this.velY = (velocity * Math.sin(this.angle)).toFixed(3);
			this.accX = 0; // zero intially
			this.accY = 0; // TODO: set option for user to set himself
			this.status = true; // true: running; false: killed

			// the following are td elements; they are being stored
			// because they have dynamic values
			this.xElm = document.createElement("td");
			this.yElm = document.createElement("td");
			this.velXElm = document.createElement("td");
			this.velYElm = document.createElement("td");
			this.statusElm = document.createElement("td");
			
			this.killElm = document.createElement("td");
			var killBtn = document.createElement("button");
			killBtn.onclick = this.killBall.bind(this);
			text(killBtn, "Kill");			
			this.killElm.appendChild(killBtn)

			// append new record in table
			var tr = document.createElement("tr");

			// insert its data
			tr.appendChild(text(document.createElement("td"), balls.length));  // number 
			tr.appendChild(text(document.createElement("td"), this.color)); 
			tr.appendChild(text(this.xElm, this.x));  
			tr.appendChild(text(this.yElm, this.y));
			tr.appendChild(text(this.velXElm, this.velX));
			tr.appendChild(text(this.velYElm, this.velY));
			tr.appendChild(text(document.createElement("td"), this.angle / Math.PI * 180));
			tr.appendChild(text(this.statusElm, this.status ? "Running" : "Killed"));
			tr.appendChild(this.killElm);
			
			this.ballTableRow = tr;

			ballListTable.appendChild(this.ballTableRow);
		};

		this.update = function(){
			this.velY -= this.gravity;
			this.x += this.velX;
			this.y -= this.velY;

			// touches right wall
			if(this.x + this.radius >= WIDTH){
				this.x = WIDTH - this.radius;
				this.velX *= - this.energyChangeFactor / 100;
			}
			// touches left wall
			else if(this.x - this.radius <= 0){
				this.x = this.radius;
				this.velX *= - this.energyChangeFactor / 100;
			}

			// touches upper wall
			if(this.y - this.radius <= 0){
				this.velY *= - this.energyChangeFactor / 100;
				this.y = this.radius;
				if(this.velY <= 2 && this.velY >= -2) this.velY = 0;
			}
			// touches bottom wall
			else if(this.y + this.radius >= HEIGHT){
				this.velY *= - this.energyChangeFactor / 100;
				this.y = HEIGHT - this.radius;

				if(this.velY <= 2 && this.velY >= -2) this.velY = 0;
			}
			
			text(this.xElm, this.x.toFixed(3));
			text(this.yElm, this.y.toFixed(3));
			text(this.velXElm, this.velX.toFixed(3));
			text(this.velYElm, this.velY.toFixed(3));
		};

		this.draw = function(){
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
	
		this.killBall = function(){
			// 'this' keyword in this method refers to ball object
			
			var button = this.killElm.firstChild;
			console.log(this.color);
			console.log(this.arrIndex);
			console.log(balls[this.arrIndex]);
			
			
			if(text(button) == "Kill"){
				balls.splice(this.arrIndex, 1);
				text(button, "Remove column");
				
				// decrease the arrIndex of all balls above this ball by one
				for(var i = this.arrIndex, len = balls.length; i < len; i++)
					balls[i].arrIndex -= 1;
					
			}else{
				ballListTable.removeChild(this.ballTableRow);
			}
		};
	}

	// balls array
	var balls = [];

	document.querySelector("input[type='button']").onclick = function(){
		var color = gId("color").value,
			velocity = parseFloat(gId("velocity").value),
			angle = parseFloat(gId("angle").value),
			radius = parseFloat(gId("radius").value),
			energyLoss = parseFloat(gId("energyLoss").value);

		var ball = new Ball(radius, color, energyLoss, balls.length);
		balls.push(ball);
		ball.start(angle, velocity);
	};

	setInterval(function(){
		
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		for(var i = 0, len = balls.length; i < len; i++){
			balls[i].draw();
			balls[i].update();
		}
	}, 1000/FPS); // 1000/x depicts x fps
})();
