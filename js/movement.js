function setupMovement(input, cameras, time){
    input.on('pointermove', function (pointer) {
        let cursor = pointer;
        //TODO: wrong angle (45% off)
        let angle = Phaser.Math.Angle.Between(game.player.x, game.player.y, cursor.x + cameras.main.scrollX, cursor.y + cameras.main.scrollY)
        game.player.rotation = angle
        game.player.body.rotation = angle

    }, this);
           
    input.on('pointerdown', function(){game.player.attack()}, this)
}

function checkMovement(){
//TODO: want to be able to use two keys at the same time    
//TODO: sometimes the cursors hangs
if (game.cursors.left.isDown)
{
    game.player.setVelocityX(-160);

}
else if (game.cursors.right.isDown)
{
    game.player.setVelocityX(160);

}
else if (game.cursors.up.isDown)
{
    game.player.setVelocityY(-160);

}
else if (game.cursors.down.isDown)
{
    game.player.setVelocityY(160);

}
else {
    game.player.setVelocityX(0);
    game.player.setVelocityY(0);
}
}