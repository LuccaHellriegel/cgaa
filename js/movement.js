function checkMovement(scene){
    input.on('pointermove', function (pointer) {
        let cursor = pointer;
        let angle = Phaser.Math.Angle.Between(player.x, player.y, cursor.x + cameras.main.scrollX, cursor.y + cameras.main.scrollY)
        player.rotation = angle
    }, scene);

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