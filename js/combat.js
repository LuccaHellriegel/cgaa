import collision from "polygon-collision";
function doDamage(weapon, enemy) {
    weapon.alreadyAttacked.push(enemy.id)
    enemy.damage(5)
}

function considerDamage(weapon, enemy) {
    return collision(weapon.polygon, enemy.polygon) 
    && weapon.attacking 
    && !weapon.alreadyAttacked.includes(enemy.id)
}

function initCombat(scene){
    scene.physics.add.overlap(scene.enemies[0].weaponGroup, scene.player.physicsGroup, doDamage, considerDamage, this);
    scene.physics.add.overlap(scene.player.weaponGroup, scene.enemies[0].physicsGroup, doDamage, considerDamage, scene);

}

module.exports = {
    doDamage,
    considerDamage,
    initCombat
}