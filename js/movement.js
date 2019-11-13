function setupMovement(input, cameras, time){
    input.on('pointermove', function (pointer) {
        let cursor = pointer;
        //TODO: wrong angle (45% off)
        let angle = Phaser.Math.Angle.Between(player.x, player.y, cursor.x + cameras.main.scrollX, cursor.y + cameras.main.scrollY)
        player.rotation = angle

    }, this);
           
    input.on('pointerdown', function(){
        if(!attacking){               
        attacking = true
        player.weapon.anims.play("attack")
        time.delayedCall(1000, function(){
            player.weapon.anims.play('idle');
            attacking = false;
        }, null, this)
    }

    }, this)
}

function checkMovement(scene){

if (cursors.left.isDown)
{
    player.setVelocityX(-160);

}
else if (cursors.right.isDown)
{
    player.setVelocityX(160);

}
else if (cursors.up.isDown)
{
    player.setVelocityY(-160);

}
else if (cursors.down.isDown)
{
    player.setVelocityY(160);

}
else {
    player.setVelocityX(0);
    player.setVelocityY(0);
}
}