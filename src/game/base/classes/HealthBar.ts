export interface HealthBarConfig {
	scene;
	healthWidth;
	healthLength;
	posCorrectionX;
	posCorrectionY;
	value;
}

export class HealthBar {
	bar: Phaser.GameObjects.Graphics;
	value: number;
	healthWidth: number;
	healthLength: number;
	p: number;
	posCorrectionX: number;
	posCorrectionY: number;
	defaultValue: any;

	constructor(public x: number, public y: number, config: HealthBarConfig) {
		this.bar = new Phaser.GameObjects.Graphics(config.scene);

		let { healthWidth, healthLength, posCorrectionX, posCorrectionY, value } = config;

		this.defaultValue = value;
		this.value = value;

		this.healthWidth = healthWidth;
		this.healthLength = healthLength;
		this.p = healthWidth / value;

		this.posCorrectionX = posCorrectionX;
		this.posCorrectionY = posCorrectionY;

		this.draw();
		config.scene.add.existing(this.bar);
	}

	decrease(amount) {
		this.value -= amount;
		if (this.value < 0) {
			this.value = 0;
		}
		this.draw();
		return this.value === 0;
	}

	drawBackground() {
		this.bar.fillStyle(0x000000);
		this.bar.fillRect(this.x, this.y, this.healthWidth + 4, this.healthLength + 4);
	}

	drawHealth() {
		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(this.x + 2, this.y + 2, this.healthWidth, this.healthLength);
		if (this.value < 30) {
			this.bar.fillStyle(0xff0000);
		} else {
			this.bar.fillStyle(0x00ff00);
		}
		let d = Math.floor(this.p * this.value);
		this.bar.fillRect(this.x + 2, this.y + 2, d, this.healthLength);
	}

	draw() {
		this.bar.clear();
		this.drawBackground();
		this.drawHealth();
	}

	move(x, y) {
		this.x = x + this.posCorrectionX;
		this.y = y + this.posCorrectionY;
		this.draw();
	}

	destroy() {
		this.bar.destroy();
	}
}
