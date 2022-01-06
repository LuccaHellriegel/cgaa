const times = [];
let fps;

const fpsEle = document.getElementById("fps");
const root = document.getElementById("root");
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

let cancelMain;
let lastTick = performance.now();
let lastRender = lastTick; // Pretend the first draw was on first update.
let tickLength = 50; // This sets your simulation to run at 20Hz (50ms)

const keys = {};

const PLAYER_ID = "PLAYER";
const PLAYER_INDEX = 0;
const PLAYER_VELOCITY = { x: 0, y: 0 };
const PLAYER_POSITION = { x: 100, y: 100 };
const PLAYER_RADIUS = 50;

const VELOCITY = [PLAYER_VELOCITY, { x: 0, y: 0 }];
const POSITION = [PLAYER_POSITION, { x: 100, y: 100 }];
const RADIUS = [PLAYER_RADIUS, 50];

const FRICTION_CONSTANT = 0.5;

const clear = () => context.clearRect(0, 0, canvas.width, canvas.height);

const drawCircle = (x, y, radius) => {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = "green";
	context.fill();
	// context.lineWidth = 5;
	context.strokeStyle = "#003300";
	context.stroke();
};

let collision = false;

const draw = () => {
	for (let index = 0; index < VELOCITY.length; index++) {
		const pos = POSITION[index];
		const rad = RADIUS[index];
		drawCircle(pos.x, pos.y, rad);
	}

	// drawCircle(100, 100, 50);
	// collision = circleVsCircleCollision(player.position.x, player.position.y, player.radius, 100, 100, 50);
};

const render = () => {
	clear();
	draw();
	lastRender = window.performance.now();
};

//TODO: convert to numbers for faster comparison?
window.addEventListener("keydown", (event) => {
	event.preventDefault();
	keys[event.key] = true;
});
window.addEventListener("keyup", (event) => {
	event.preventDefault();
	keys[event.key] = false;
});

const keysActive = (keyArr, positive, negative) => () => {
	//"for" is usually faster than "some" or other chaining functions
	for (let key of keyArr) {
		if (keys[key]) return positive;
	}
	return negative;
};

const isLeft = keysActive(["ArrowLeft", "a", "A"], -1, 0);
const isRight = keysActive(["ArrowRight", "d", "D"], 1, 0);
const isUp = keysActive(["ArrowUp", "w", "W"], -1, 0);
const isDown = keysActive(["ArrowDown", "s", "S"], 1, 0);

const circleVsCircleCollision = (x1, y1, radius1, x2, y2, radius2) => {
	var dx = x1 + radius1 - (x2 + radius2); // difference between right edges on x-axis
	var dy = y1 + radius1 - (y2 + radius1); // difference between right edges on y-axis
	var distance = Math.sqrt(dx * dx + dy * dy); //pythagoras
	return distance < radius1 + radius2;
};

const clamp = (val, min, max) => {
	if (val < min) {
		return min;
	} else if (val > max) {
		return max;
	} else {
		return val;
	}
};

const move = (deltaTime) => {
	for (let index = 0; index < VELOCITY.length; index++) {
		const pos = POSITION[index];
		const rad = RADIUS[index];
		const velocity = VELOCITY[index];
		velocity.x *= Math.pow(FRICTION_CONSTANT, deltaTime);
		velocity.y *= Math.pow(FRICTION_CONSTANT, deltaTime);
		if (index === PLAYER_INDEX) {
			velocity.x += 3.48 * (isLeft() + isRight());
			velocity.y += 3.48 * (isUp() + isDown());
		}
		pos.x = clamp(pos.x + velocity.x * deltaTime, 0 + rad, canvas.width - rad);
		pos.y = clamp(pos.y + velocity.y * deltaTime, 0 + rad, canvas.height - rad);
	}
};

const cancel = () => window.cancelAnimationFrame(cancelMain);

function queueUpdates(numTicks) {
	for (let i = 0; i < numTicks; i++) {
		lastTick = lastTick + tickLength; // Now lastTick is this tick.
		move(lastTick - lastRender);
	}
}

const main = (tFrame) => {
	cancelMain = window.requestAnimationFrame(main);
	const nextTick = lastTick + tickLength;
	let numTicks = 0;

	// If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
	// If tFrame = nextTick then 1 tick needs to be updated (and so forth).
	// Note: As we mention in summary, you should keep track of how large numTicks is.
	// If it is large, then either your game was asleep, or the machine cannot keep up.
	if (tFrame > nextTick) {
		const timeSinceTick = tFrame - lastTick;
		numTicks = Math.floor(timeSinceTick / tickLength);
	}

	queueUpdates(numTicks);
	render();
};

main(window.performance.now());

const but = document.createElement("button");
but.style.width = "50";
but.style.height = "50px";
but.innerText = "Cancel";
root.prepend(but);
but.addEventListener("click", cancel);

function refreshLoop() {
	window.requestAnimationFrame(() => {
		const now = performance.now();
		while (times.length > 0 && times[0] <= now - 1000) {
			times.shift();
		}
		times.push(now);
		fps = times.length;
		fpsEle.innerText =
			"Pos: " +
			JSON.stringify(POSITION) +
			"\nCollision: " +
			collision +
			"\nFPS: " +
			fps +
			"\n Velo: " +
			JSON.stringify(VELOCITY);
		refreshLoop();
	});
}

refreshLoop();
