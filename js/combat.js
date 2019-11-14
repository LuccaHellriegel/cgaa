function enemyCollision(weapon, enemy) {
    if (weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id)) {
        weapon.alreadyAttacked.push(enemy.id)
        enemy.damage(5)

    }
}

function overlap(weapon, enemy) {
    var boundsA = weapon.getBounds();
    var boundsB = enemy.getBounds();

    console.log(Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB));

}

module.exports = {
    enemyCollision,
    overlap
}