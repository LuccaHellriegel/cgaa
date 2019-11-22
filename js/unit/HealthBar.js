export class HealthBar {
    constructor(scene, x, y, healthWidth, healthLength) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value = 100;
        this.healthWidth = healthWidth;
        this.healthLength = healthLength;
        this.p = healthWidth / 100;
        this.draw();
        scene.add.existing(this.bar);
    }

    decrease(amount) {
        this.value -= amount;
        if (this.value < 0) {
            this.value = 0;
        }
        this.draw();
        return (this.value === 0);
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
        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

    draw() {
        this.bar.clear();
        this.drawBackground();
        this.drawHealth();
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    destroy() {
        this.bar.destroy();
    }
}