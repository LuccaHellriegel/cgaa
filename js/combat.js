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

module.exports = {
    doDamage,
    considerDamage
}