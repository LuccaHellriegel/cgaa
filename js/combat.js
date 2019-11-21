function doDamage(weapon, enemy) {
    weapon.alreadyAttacked.push(enemy.id)
    enemy.damage(5)
}

function considerDamage(weapon, enemy) {
    return weapon.polygon.checkForCollision(enemy)
    && weapon.attacking 
    && !weapon.alreadyAttacked.includes(enemy.id)
}

function initCombat(scene){
    //TODO: replace this with custom polygon overlap for better performance
    scene.physics.add.overlap(scene.enemies[0].weaponGroup, scene.player.physicsGroup, doDamage, considerDamage, scene);
    scene.physics.add.overlap(scene.player.weaponGroup, scene.enemies[0].physicsGroup, doDamage, considerDamage, scene);

}

module.exports = {
    initCombat
}