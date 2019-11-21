export class HealthBar {
    constructor(scene, x, y, healthLength, healthWidth) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value = 100;
        this.healthWidth = healthWidth;
        this.healthLength = healthLength;
        this.p = healthLength / 100;
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
    draw() {
        this.bar.clear();
        //  BG
        //TODO: make +4 variable
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.healthLength + 4, this.healthWidth + 4);
        //  Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, this.healthLength, this.healthWidth);
        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }
        let d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }
    //TODO: might be able to replace this with containers
    move(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }
    destroy() {
        this.bar.destroy();
    }
}