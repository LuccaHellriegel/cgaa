function setupMovement(input, cameras, player) {
    input.on('pointermove', function (pointer) {
        let cursor = pointer;
        //TODO: wrong angle (45% off)
        let angle = Phaser.Math.Angle.Between(player.x, player.y, cursor.x + cameras.main.scrollX, cursor.y + cameras.main.scrollY)
        player.setRotation(angle)
    }, this);

    input.on('pointerdown', function () {
        player.attack()
    }, this)
}

function checkMovement(scene) {
    //TODO: want to be able to use two keys at the same time    
    //TODO: sometimes the cursors hangs
    if (scene.cursors.left.isDown) {
        scene.player.setVelocityX(-160);

    } else if (scene.cursors.right.isDown) {
        scene.player.setVelocityX(160);

    } else if (scene.cursors.up.isDown) {
        scene.player.setVelocityY(-160);

    } else if (scene.cursors.down.isDown) {
        scene.player.setVelocityY(160);

    } else {
        scene.player.setVelocityX(0);
        scene.player.setVelocityY(0);
    }
}

module.exports = {
    setupMovement,
    checkMovement
}