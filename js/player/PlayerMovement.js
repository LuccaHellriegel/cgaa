export class PlayerMovement {
    constructor(player, scene) {
        this.left;
        this.right
        this.up
        this.down
        this.player = player
        this.cursors = this.createKeyboardInput(scene)
    }

    createKeyboardInput(scene){
        return scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    updateButtonStates() {
        this.left = this.cursors.left.isDown
        this.right = this.cursors.right.isDown
        this.up = this.cursors.up.isDown
        this.down = this.cursors.down.isDown
    }

    updatePlayerVelocity() {
        if (this.left) {
            //scene.sound.play("step");
            this.player.setVelocityX(-180);
        }

        if (this.right) {
            //scene.sound.play("step");
            this.player.setVelocityX(180);
        }

        if (this.up) {
            //scene.sound.play("step");
            this.player.setVelocityY(-180);
        }

        if (this.down) {
            //scene.sound.play("step");
            this.player.setVelocityY(180);
        }

        let noButtonDown = !this.left && !this.right && !this.up && !this.down
        if (noButtonDown) {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }
    }

    update(){
        this.updateButtonStates()
        this.updatePlayerVelocity()
    }

}
