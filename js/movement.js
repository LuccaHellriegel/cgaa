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