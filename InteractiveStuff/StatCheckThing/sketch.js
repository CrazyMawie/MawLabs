let poly = [];
let sides = 5;
let cx, cy, pr;
let ball;
let succeededInYellow = false;
let succeededInComplication = false;
let ballInMotion = false;
let complicationEnabled = true;
let displayEndScreen = false;
let errorTriggered = false;
let isMobile = false;
let isSound = true;
let buildSoundTriggered = true;

// Per-Vertex Default Size Values (1..10)
let pointSizes = [5, 5, 5, 5, 5];
let valueDisplays = [];
// For Yellow Polygon
let yellowSizes = [1, 1, 1, 1, 1];
let yellowDisplays = [];
// Red Pentagon Scale
let redScale = 1.2;
let redScaleDisplay;
// Synergy Bonus
let yellowBonus = 0;
let yellowBonusDisplay;
let uiElements = [];
let bounceSndArray = [];

function preload() {
  backgroundImg = loadImage("assets/background.png");
  successImg = loadImage("assets/successScreen.png");
  errorImg = loadImage("assets/errorScreen.png");
  failureImg = loadImage("assets/failureScreen.png");
  complicationImg = loadImage("assets/complicationScreen.png");
  mobileImg = loadImage("assets/mobileIcon.png");
  desktopImg = loadImage("assets/desktopIcon.png");
  soundEnabledImg = loadImage("assets/soundEnabledIcon.png");
  soundDisabledImg = loadImage("assets/soundDisabledIcon.png");
  dotImg = loadImage("assets/dotIcon.png");

   buttonSnd = loadSound("sounds/buttonPress.wav");
   successSnd = loadSound("sounds/success.wav");
   failureSnd = loadSound("sounds/failure.wav");
   complicationSnd = loadSound("sounds/complication.wav");
   launchSnd = loadSound("sounds/launch.wav");
   
   bounce1Snd = loadSound("sounds/bounce1.wav");
   bounce2Snd = loadSound("sounds/bounce2.wav");
   bounce3Snd = loadSound("sounds/bounce3.wav");

   buildSnd = loadSound("sounds/outcomeBuildup.wav");
   
}

function setup() {
	bounceSndArray = [bounce1Snd, bounce2Snd, bounce3Snd];

	let userAgent = navigator.userAgent;
  	let mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  	isMobile = mobileRegex.test(userAgent);
	if (isMobile) {
		isSound = false;
	}

	createCanvas(1420, 800, document.getElementById('sketch-container'));
	let canvasRect = document.querySelector('canvas').getBoundingClientRect();
	let canvasOffsetX = canvasRect.left;
	let canvasOffsetY = canvasRect.top;
	cx = width / 2;
	cy = height / 2;
	pr = min(width, height) * 0.38; // Pentagon "radius"
	poly = polygonVertices(sides, cx, cy, pr, -PI/2, pointSizes);

	// B a l l
	ball = new Ball(createVector(cx, cy), 9.2);

	
	strokeWeight(3);
	let launchBtn = createButton('LAUNCH CHALLENGE');
	let relX_launch = 640;
	let relY_launch = 700;
	launchBtn.position(relX_launch + canvasOffsetX, relY_launch + canvasOffsetY);
	uiElements.push({el: launchBtn, relX: relX_launch, relY: relY_launch});
		launchBtn.mousePressed(() => {if (isSound){
		buttonSnd.play();
	}  fireBall(); });

	// Bounding Pentagon Controls
	for (let i = 0; i < sides; i++) {
		
		let relX_base = width - 150;
		let relY_base = 50 + i * 38.5;

		let dec = createButton('-');
		let relX_dec = relX_base + 40;
		let relY_dec = relY_base;
		dec.position(relX_dec + canvasOffsetX, relY_dec + canvasOffsetY);
		uiElements.push({el: dec, relX: relX_dec, relY: relY_dec});
		dec.mousePressed(() => changeSize(i, -1));

		let val = createDiv(String(pointSizes[i]));
		let relX_val = relX_base + 75;
		let relY_val = relY_base - 5;
		
		val.position(relX_val + canvasOffsetX, relY_val + canvasOffsetY);
		uiElements.push({el: val, relX: relX_val, relY: relY_val});
		val.style('font-family', 'sans-serif');
		val.style('font-size', '28px');
		val.style('color', 'white');
		valueDisplays.push(val);

		let inc = createButton('+');
		let relX_inc = relX_base + 105;
		let relY_inc = relY_base;
		inc.position(relX_inc + canvasOffsetX, relY_inc + canvasOffsetY);
		uiElements.push({el: inc, relX: relX_inc, relY: relY_inc});
		inc.mousePressed(() => changeSize(i, 1));
	}

	// Yellow Pentagon Controls
	for (let i = 0; i < sides; i++) {
		let relX_base = width - 150;
		let relY_base = 307.5 + i * 38.5;

		let decY = createButton('-');
		let relX_decY = relX_base + 40;
		let relY_decY = relY_base;
		decY.position(relX_decY + canvasOffsetX, relY_decY + canvasOffsetY);
		uiElements.push({el: decY, relX: relX_decY, relY: relY_decY});
		decY.mousePressed(() => changeYellowSize(i, -1));

		let valY = createDiv(String(yellowSizes[i]));
		let relX_valY = relX_base + 75;
		let relY_valY = relY_base - 5;
		valY.position(relX_valY + canvasOffsetX, relY_valY + canvasOffsetY);
		uiElements.push({el: valY, relX: relX_valY, relY: relY_valY});

		valY.style('font-family', 'sans-serif');
		valY.style('font-size', '28px');
		valY.style('color', 'white');
		yellowDisplays.push(valY);

		let incY = createButton('+');
		let relX_incY = relX_base + 105;
		let relY_incY = relY_base;
		incY.position(relX_incY + canvasOffsetX, relY_incY + canvasOffsetY);
		uiElements.push({el: incY, relX: relX_incY, relY: relY_incY});
		incY.mousePressed(() => changeYellowSize(i, 1));
	}

	// Red Pentagon Scalar
	{
		let relX_base = width - 250;
		let relY_base = 240 + sides * 48 + 10 + sides * 36 + 20;

		let toggleBtn = createButton('Toggle');
		let relX_toggle = 1275;
		let relY_toggle = 660;
		toggleBtn.position(relX_toggle + canvasOffsetX, relY_toggle + canvasOffsetY);
		uiElements.push({el: toggleBtn, relX: relX_toggle, relY: relY_toggle});
		toggleBtn.mousePressed(() => {if (isSound){
		buttonSnd.play();
	} if (ballInMotion || displayEndScreen) {

		} else { complicationEnabled = !complicationEnabled; }});
		
		let mobileBtn = createButton('Mobile?');
		let relX_mobile = 930;
		let relY_mobile = 60;
		mobileBtn.position(relX_mobile + canvasOffsetX, relY_mobile + canvasOffsetY);
		uiElements.push({el: mobileBtn, relX: relX_mobile, relY: relY_mobile});
		mobileBtn.mousePressed(() => {if (isSound){
		buttonSnd.play();
	}  isMobile = !isMobile; })

		let soundBtn = createButton('Sound?');
		let relX_sound = 1050;
		let relY_sound = 60;
		soundBtn.position(relX_sound + canvasOffsetX, relY_sound + canvasOffsetY);
		uiElements.push({el: soundBtn, relX: relX_sound, relY: relY_sound});
		soundBtn.mousePressed(() => {if (isMobile === false) {isSound = !isSound; } if (isSound){
		buttonSnd.play();
	} })


		let dec = createButton('-');
		let relX_dec = relX_base + 80;
		let relY_dec = relY_base + 35;
		dec.position(relX_dec + canvasOffsetX, relY_dec + canvasOffsetY);
		uiElements.push({el: dec, relX: relX_dec, relY: relY_dec});
		dec.mousePressed(() => changeRedScale(-0.05));

		
		redScaleDisplay = createDiv(String(redScale.toFixed(2) + 'x'));
		let relX_redScale = relX_base + 110;
		let relY_redScale = relY_base + 35;
		redScaleDisplay.position(relX_redScale + canvasOffsetX, relY_redScale + canvasOffsetY);
		uiElements.push({el: redScaleDisplay, relX: relX_redScale, relY: relY_redScale});
		redScaleDisplay.style('font-family', 'sans-serif');
		redScaleDisplay.style('font-size', '20px');
		redScaleDisplay.style('color', 'white')

		let inc = createButton('+');
		let relX_inc = relX_base + 170;
		let relY_inc = relY_base + 35;
		inc.position(relX_inc + canvasOffsetX, relY_inc + canvasOffsetY);
		uiElements.push({el: inc, relX: relX_inc, relY: relY_inc});
		inc.mousePressed(() => changeRedScale(0.05));
	}

	// Synergy Bonus Controls
	{
		let relX_base = width - 200;
		let relY_base = 30 + sides * 48 + 10 + sides * 36 + 20 + 50;

		let dec = createButton('-');
		let relX_dec_bonus = relX_base + 70;
		let relY_dec_bonus = relY_base + 5;
		dec.position(relX_dec_bonus + canvasOffsetX, relY_dec_bonus + canvasOffsetY);
		uiElements.push({el: dec, relX: relX_dec_bonus, relY: relY_dec_bonus});
		dec.mousePressed(() => changeYellowBonus(-1));

		yellowBonusDisplay = createDiv(String(yellowBonus));
		let relX_bonus_display = relX_base + 110;
		let relY_bonus_display = relY_base;
		yellowBonusDisplay.position(relX_bonus_display + canvasOffsetX, relY_bonus_display + canvasOffsetY);
		uiElements.push({el: yellowBonusDisplay, relX: relX_bonus_display, relY: relY_bonus_display});
		yellowBonusDisplay.style('font-family', 'sans-serif');
		yellowBonusDisplay.style('font-size', '32px');
		yellowBonusDisplay.style('color', 'white');

		let inc = createButton('+');
		let relX_inc_bonus = relX_base + 150;
		let relY_inc_bonus = relY_base + 5;
		inc.position(relX_inc_bonus + canvasOffsetX, relY_inc_bonus + canvasOffsetY);
		uiElements.push({el: inc, relX: relX_inc_bonus, relY: relY_inc_bonus});
		inc.mousePressed(() => changeYellowBonus(1));
	}
}

function windowResized() {
	
	if (isMobile) {

	} else {
		let canvasRect = document.querySelector('canvas').getBoundingClientRect();
		let canvasOffsetX = canvasRect.left;
		let canvasOffsetY = canvasRect.top;
		for (let item of uiElements) {
		item.el.position(item.relX + canvasOffsetX, item.relY + canvasOffsetY);
	}
	}

	
}

function draw() {
	background(200);
	imageMode(CENTER);
	image(backgroundImg, width/2, height/2, width, height);

	poly = polygonVertices(sides, cx, cy, pr, -PI/2, pointSizes);

	// Error Resolver if ball escapes bounds
	if (!pointInPolygon(ball.pos, poly)) {
		errorTriggered = true;
		ball.pos.set(cx, cy);
		ball.vel.set(0, 0);
	}

	// Draw Bounding Pentagon
	fill(128, 0, 128, 60); // Purple
	stroke(168, 60, 168);
	strokeWeight(3);
	beginShape();
	for (let v of poly) vertex(v.x, v.y);
	endShape(CLOSE);

	// Draw Red Pentagon (Complication)
	if (complicationEnabled) {
		let polyYellow = polygonVertices(sides, cx, cy, pr, -PI/2, yellowSizes);
		let yellowBonusScale = 1.0 + (yellowBonus * 0.075);
		polyYellow = scalePolygonFromCenter(polyYellow, cx, cy, yellowBonusScale);
		let polyRed = scalePolygonFromCenter(polyYellow, cx, cy, redScale);

		// Clip Red Polygon oh god
		let clippedPieces = sutherland_hodgman(polyRed, poly);

		if (clippedPieces && clippedPieces.length > 0) {
			fill(255, 0, 0, 80);
			noStroke();
			for (let piece of clippedPieces) {
				if (piece.length < 3) continue;
				beginShape();
				for (let v of piece) vertex(v.x, v.y);
				endShape(CLOSE);
			}
			stroke(255, 0, 0, 0);
			strokeWeight(3);
			for (let i = 0; i < poly.length; i++) {
				let a = poly[i];
				let b = poly[(i + 1) % poly.length];
				let mid = createVector((a.x + b.x) / 2, (a.y + b.y) / 2);
				if (pointInPolygon(mid, polyRed) || pointInPolygon(a, polyRed) || pointInPolygon(b, polyRed)) {
					line(a.x, a.y, b.x, b.y);
				}
			}
		}
	}

	// Yellow Polygon Display
	let polyYellow = polygonVertices(sides, cx, cy, pr, -PI/2, yellowSizes);
	// Apply Synergy Bonus Scale
	let yellowBonusScale = 1.0 + (yellowBonus * 0.075);
	polyYellow = scalePolygonFromCenter(polyYellow, cx, cy, yellowBonusScale);

	fill(255, 204, 0, 90); // Yellow
	stroke(255, 204, 0);
	strokeWeight(3);
	beginShape();
	for (let v of polyYellow) vertex(v.x, v.y);
	endShape(CLOSE);
	strokeWeight(1);

	// Update Ball
	ball.update();
	ball.checkCollisions(poly);
	ball.draw();

	// Calculate Success Odds
	let areaPercentage = calculateAreaPercentage(poly, polyYellow);
	noStroke();
	fill(255);
	textSize(14);
	textSize(23);
	textAlign(CENTER);

	if (areaPercentage >= 100) {
		fill(255, 225, 30);
		text('100%', 1100, 145);
	} else {
		if (areaPercentage <= 25) {
			fill(255, 30, 30);
		}
		text(areaPercentage.toFixed(1) + '%', 1102, 145);
	}

	// Display End Screen based on results

	if (isMobile) {
		image(mobileImg, 960, 30, 60, 60);
	} else {
		image(desktopImg, 960, 30, 60, 60);
	}

	if (isSound) {
		image(soundEnabledImg, 1080, 30, 60, 60);
		} else {
		image(soundDisabledImg, 1080, 30, 60, 60);
	}

	if (displayEndScreen) {

		if (errorTriggered) {
			image(errorImg, width/2, height/2, width, height);
		} else {
			if (succeededInYellow) {
			image(successImg, width/2, height/2, width, height);
		} else {
			if (complicationEnabled) {
				if (succeededInComplication) {
					image(complicationImg, width/2, height/2, width, height);
				} else {
					image(failureImg, width/2, height/2, width, height);
				}
			} else {
				image(failureImg, width/2, height/2, width, height);
			}
		}
		}

	}

	
}

function keyPressed() {
	if (key === ' ' || key === 'f' || key === 'F') {
		if (ballInMotion || displayEndScreen) {

		} else {
			fireBall();
		}
		
	}
}

function mouseClicked() {
  if (displayEndScreen) {
	if (isSound){
		buttonSnd.play();
	} 
	buildSoundTriggered = true;
	displayEndScreen = false;
	errorTriggered = false;
	ball.pos.set(cx, cy);
	ball.vel.set(0, 0);
  }
}

function fireBall() {
	if (ballInMotion || displayEndScreen) {

		} else {

	if (isSound){
		launchSnd.play();
	}


	// Random direction and strength
	ball.pos.set(cx, cy);
	ball.vel.set(0, 0);
	let angle = random(TWO_PI);
	let strength = random(10, 14);
	ball.vel = p5.Vector.fromAngle(angle).mult(strength);
  ballInMotion = true;
  displayEndScreen = false;
		}
	
	
}

function polygonVertices(sides, cx, cy, radius, rotation = 0) {
	let verts = [];
	for (let i = 0; i < sides; i++) {
		let a = rotation + TWO_PI * i / sides;
		let r = radius;
		
		if (arguments.length >= 6 && Array.isArray(arguments[5])) {
			let sizes = arguments[5];
			let s = sizes[i] || 5;
			// Calc Inner Radi
			let minRadius;
			if (typeof ball !== 'undefined' && ball && ball.r) {
				minRadius = ball.r + 12;
			} else {
				minRadius = radius * 0.12; // Fallback if ball broke
			}
			let maxRadius = radius+12;
			r = map(s, 1, 10, minRadius, maxRadius);
		}
		verts.push(createVector(cx + cos(a) * r, cy + sin(a) * r));
	}
	return verts;
}

class Ball {
	constructor(pos, r) {
		this.pos = pos.copy();
		this.r = r;
		this.vel = createVector(0, 0);
		this.friction = 0.995; // Reduction per frame
		this.elasticity = 0.95; // Reduction per bounce
	}

	update() {
		// Integrate
		this.pos.add(this.vel);

		// Friction/reduction
		this.vel.mult(this.friction);

		if (this.vel.mag() < .8 && ballInMotion && buildSoundTriggered) {
			if (errorTriggered || isSound === false) {

			} else {
			buildSoundTriggered = false;
			buildSnd.play();
			}
			
		}


		// Stop when very slow, resolve screens
		if (this.vel.mag() < 0.6 && ballInMotion) {
      this.vel.set(0, 0);
      ballInMotion = false;
	  displayEndScreen = true;
      checkIfInYellow();
	  checkIfInComplication()


	if (isSound){
		if (errorTriggered) {

		} else if (succeededInYellow) {
			successSnd.play();
		} else if (complicationEnabled) {
			if (succeededInComplication) {
				complicationSnd.play();
			} else {
				failureSnd.play();
			}
		} else {
			failureSnd.play();
		}
	} 


    }
	}

	draw() {
		fill(0);
		noStroke();
		image(dotImg, this.pos.x, this.pos.y, 22, 22);
	}

	checkCollisions(poly) {
		// Check distance to edges
		for (let i = 0; i < poly.length; i++) {
			let a = poly[i];
			let b = poly[(i + 1) % poly.length];

			let cp = closestPointOnSegment(a, b, this.pos);
			let dir = p5.Vector.sub(this.pos, cp);
			let dist = dir.mag();

			if (dist < this.r - 0.001) {
				// Compute normal
				if (dist === 0) {
					// Fallback if somehow perfectly on edge
					let edge = p5.Vector.sub(b, a);
					dir = createVector(-edge.y, edge.x).normalize();
				} else {
					dir.normalize();
				}

				// Push ball out
				let pushOut = p5.Vector.mult(dir, this.r - dist + 0.5);
				this.pos.add(pushOut);

				// Reflect velocity
				let v = this.vel.copy();
				let dot = v.dot(dir);
				let reflected = p5.Vector.sub(v, p5.Vector.mult(dir, 2 * dot));
				this.vel = reflected.mult(this.elasticity);

				if (isSound){
					random(bounceSndArray).play();
				}
			}
		}
	}
}

// Get Closest Point
function closestPointOnSegment(A, B, P) {
	let AB = p5.Vector.sub(B, A);
	let t = p5.Vector.sub(P, A).dot(AB) / AB.dot(AB);
	t = constrain(t, 0, 1);
	return p5.Vector.add(A, p5.Vector.mult(AB, t));
}

// Change Size of a Vertex (Challenge Stat)
function changeSize(index, delta) {
	if (ballInMotion || displayEndScreen) {

		} else {

	if (isSound){
		buttonSnd.play();
	}
	

	let relX_base = width - 150;
	let relY_base = 50 + [index] * 38.5;
	let relX_val = relX_base + 75;
	let relY_val = relY_base - 5;
	let relX_valY = relX_base + 75;
	let relY_valY = relY_base - 5;
	let canvasRect = document.querySelector('canvas').getBoundingClientRect();
	let canvasOffsetX = canvasRect.left;
	let canvasOffsetY = canvasRect.top;
			
	pointSizes[index] = constrain(pointSizes[index] + delta, 1, 10);

	if (isMobile) {

	} else {
	if (pointSizes[index] > 9) {
		valueDisplays[index].position(relX_val + canvasOffsetX  - 8, relY_val + canvasOffsetY);
	} else {
		valueDisplays[index].position(relX_val + canvasOffsetX, relY_val + canvasOffsetY);
	}
}

	if (valueDisplays[index]) valueDisplays[index].html(String(pointSizes[index]));
}
}

// Change Size of a Yellow Vertex (Character Stat)
function changeYellowSize(index, delta) {
	if (ballInMotion || displayEndScreen) {

		} else {

	if (isSound){
		buttonSnd.play();
	}

	let relX_base = width - 150;
	let relY_base = 308 + [index] * 38.5;
	let relX_val = relX_base + 75;
	let relY_val = relY_base - 5;
	let relX_valY = relX_base + 75;
	let relY_valY = relY_base - 5;
	let canvasRect = document.querySelector('canvas').getBoundingClientRect();
	let canvasOffsetX = canvasRect.left;
	let canvasOffsetY = canvasRect.top;

	yellowSizes[index] = constrain(yellowSizes[index] + delta, 1, 15);
	if (yellowDisplays[index]) {

		if (yellowSizes[index] > 9) {
			yellowDisplays[index].style('color', 'orange');

			if (yellowSizes[index] > 14) {
			yellowDisplays[index].style('font-size', '18px');
			yellowDisplays[index].html(String('MAX'));
			if (isMobile) {

	} else {
			yellowDisplays[index].position((relX_val - 11) + canvasOffsetX, relY_val + canvasOffsetY + 6);
	}
			} else {
			yellowDisplays[index].style('font-size', '28px');
			yellowDisplays[index].html(String(yellowSizes[index]));
			if (isMobile) {

	} else {
			yellowDisplays[index].position(relX_val + canvasOffsetX - 8, relY_val + canvasOffsetY);
			
			}
		}
			
		} else {
			yellowDisplays[index].style('font-size', '28px');
			yellowDisplays[index].style('color', 'white');
			yellowDisplays[index].html(String(yellowSizes[index]));
			if (isMobile) {

	} else {
			yellowDisplays[index].position(relX_val + canvasOffsetX, relY_val + canvasOffsetY);
	}
		}
		
		

 }
}
}

// Get Point in Polygon
function pointInPolygon(pt, verts) {
	let x = pt.x, y = pt.y;
	let inside = false;
	for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
		let xi = verts[i].x, yi = verts[i].y;
		let xj = verts[j].x, yj = verts[j].y;

		let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
		if (intersect) inside = !inside;
	}
	return inside;
}

function checkIfInYellow() {
	// Check if Ball in Yellow Range
	let polyYellow = polygonVertices(sides, cx, cy, pr, -PI/2, yellowSizes);
	let yellowBonusScale = 1.0 + (yellowBonus * 0.075);
	polyYellow = scalePolygonFromCenter(polyYellow, cx, cy, yellowBonusScale);
	succeededInYellow = pointInPolygon(ball.pos, polyYellow);
	console.log('succeededInYellow:', succeededInYellow);
	return succeededInYellow;
}

function checkIfInComplication() {
	// Check if Ball in Complication Range
	let polyYellow = polygonVertices(sides, cx, cy, pr, -PI/2, yellowSizes);
	let yellowBonusScale = 1.0 + (yellowBonus * 0.075);
	polyYellow = scalePolygonFromCenter(polyYellow, cx, cy, yellowBonusScale);
	let polyRed = scalePolygonFromCenter(polyYellow, cx, cy, redScale);
	succeededInComplication = pointInPolygon(ball.pos, polyRed);
	console.log('succeededInComplication:', succeededInComplication);
	return succeededInComplication;
}

// Calc Area using Shoelace Formula
function polygonArea(verts) {
	let area = 0;
	for (let i = 0; i < verts.length; i++) {
		let v1 = verts[i];
		let v2 = verts[(i + 1) % verts.length];
		area += v1.x * v2.y - v2.x * v1.y;
	}
	return Math.abs(area) / 2;
}

// Calc Percentage of Challenge Pentagon contained within Character Pentagon
function calculateAreaPercentage(blackPoly, yellowPoly) {
	let blackArea = polygonArea(blackPoly);
	let intersectionPieces = sutherland_hodgman(yellowPoly, blackPoly);

	let intersectionArea = 0;
	if (intersectionPieces && intersectionPieces.length) {
		for (let piece of intersectionPieces) {
			if (piece.length >= 3) intersectionArea += polygonArea(piece);
		}
	}

	// End percentage of black area covered by yellow
	let percentage = (intersectionArea / blackArea) * 100;
	return Math.min(percentage, 100);
}

function scalePolygonFromCenter(verts, cx, cy, scale) {
	let scaled = [];
	for (let v of verts) {
		let dir = p5.Vector.sub(v, createVector(cx, cy));
		let vScaled = p5.Vector.add(createVector(cx, cy), dir.mult(scale));
		scaled.push(vScaled);
	}
	return scaled;
}

// Change Complication Scale
function changeRedScale(delta) {
	if (ballInMotion || displayEndScreen) {

		} else {

	if (isSound){
		buttonSnd.play();
	}

	redScale = constrain(redScale + delta, 1.0, 2.0);
	if (redScaleDisplay) redScaleDisplay.html(String(redScale.toFixed(2) + 'x'));
		}
}

// Change Synergy Bonus Tier
function changeYellowBonus(delta) {
	if (ballInMotion || displayEndScreen) {

		} else {

	if (isSound){
		buttonSnd.play();
	}
	
	yellowBonus = constrain(yellowBonus + delta, 0, 3);
	if (yellowBonusDisplay) yellowBonusDisplay.html(String(yellowBonus));
		}
}

function triangulateEarClipping(poly) {
	if (poly.length < 3) return [];

	let pts = poly.map(p => p.copy());

	if (signedArea(pts) < 0) pts.reverse();
	let idx = pts.map((_, i) => i);
	let triangles = [];

	function isConvex(a, b, c) {
		let cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
		return cross > 1e-6;
	}

	function pointInTriangle(pt, a, b, c) {

		let v0 = p5.Vector.sub(c, a);
		let v1 = p5.Vector.sub(b, a);
		let v2 = p5.Vector.sub(pt, a);

		let dot00 = v0.dot(v0);
		let dot01 = v0.dot(v1);
		let dot02 = v0.dot(v2);
		let dot11 = v1.dot(v1);
		let dot12 = v1.dot(v2);

		let invDenom = 1 / (dot00 * dot11 - dot01 * dot01 + 1e-12);
		let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		let v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		return (u >= -1e-6) && (v >= -1e-6) && (u + v <= 1 + 1e-6);
	}

	while (idx.length > 3) {
		let earFound = false;
		for (let i = 0; i < idx.length; i++) {
			let iPrev = idx[(i - 1 + idx.length) % idx.length];
			let iCurr = idx[i];
			let iNext = idx[(i + 1) % idx.length];
			let a = pts[iPrev], b = pts[iCurr], c = pts[iNext];
			if (!isConvex(a, b, c)) continue;
			let anyInside = false;
			for (let j = 0; j < idx.length; j++) {
				let k = idx[j];
				if (k === iPrev || k === iCurr || k === iNext) continue;
				if (pointInTriangle(pts[k], a, b, c)) { anyInside = true; break; }
			}
			if (anyInside) continue;
			triangles.push([a.copy(), b.copy(), c.copy()]);
			idx.splice(i, 1);
			earFound = true;
			break;
		}
		if (!earFound) break;
	}
	if (idx.length === 3) {
		triangles.push([pts[idx[0]].copy(), pts[idx[1]].copy(), pts[idx[2]].copy()]);
	}
	return triangles;
}

function signedArea(pts) {
	let a = 0;
	for (let i = 0; i < pts.length; i++) {
		let j = (i + 1) % pts.length;
		a += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
	}
	return a / 2;
}


function clipAgainstConvex(subject, clip) {
	let output = subject.map(p => p.copy());
	for (let i = 0; i < clip.length; i++) {
		let input = output.slice();
		output = [];
		if (input.length === 0) break;
		let A = clip[i];
		let B = clip[(i + 1) % clip.length];
		for (let j = 0; j < input.length; j++) {
			let P = input[j];
			let Q = input[(j + 1) % input.length];
			let P_inside = pointOnLeftSideOfEdge(P, A, B);
			let Q_inside = pointOnLeftSideOfEdge(Q, A, B);
			if (P_inside && Q_inside) {
				output.push(Q.copy());
			} else if (P_inside && !Q_inside) {
				let inter = lineIntersection(P, Q, A, B);
				if (inter) output.push(inter);
			} else if (!P_inside && Q_inside) {
				let inter = lineIntersection(P, Q, A, B);
				if (inter) {
					output.push(inter);
					output.push(Q.copy());
				}
			}
		}
	}
	return output;
}


function sutherland_hodgman(subjectPolygon, clipPolygon) {

	let triangles = triangulateEarClipping(clipPolygon);
	let pieces = [];
	for (let tri of triangles) {

		if (signedArea(tri) < 0) tri.reverse();
		let clipped = clipAgainstConvex(subjectPolygon, tri);
		if (clipped.length >= 3) pieces.push(clipped);
	}
	return pieces;
}

// Check if a point lies on segment
function pointOnSegment(point, segStart, segEnd) {
	let crossproduct = (point.y - segStart.y) * (segEnd.x - segStart.x) - (point.x - segStart.x) * (segEnd.y - segStart.y);
	if (Math.abs(crossproduct) > 1e-4) return false;
    
	if (point.x < min(segStart.x, segEnd.x) - 0.1 || point.x > max(segStart.x, segEnd.x) + 0.1) return false;
	if (point.y < min(segStart.y, segEnd.y) - 0.1 || point.y > max(segStart.y, segEnd.y) + 0.1) return false;
    
	return true;
}


function pointOnLeftSideOfEdge(point, edge_start, edge_end) {
	let cross = (edge_end.x - edge_start.x) * (point.y - edge_start.y) -
				(edge_end.y - edge_start.y) * (point.x - edge_start.x);
	return cross >= -1e-6;
}

// Find intersection of two line segments
function lineIntersection(p1, p2, p3, p4) {
	let x1 = p1.x, y1 = p1.y;
	let x2 = p2.x, y2 = p2.y;
	let x3 = p3.x, y3 = p3.y;
	let x4 = p4.x, y4 = p4.y;
	
	let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	
	if (Math.abs(denom) < 1e-6) return null;
	
	let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
	
	let x = x1 + t * (x2 - x1);
	let y = y1 + t * (y2 - y1);
	
	return createVector(x, y);
}
