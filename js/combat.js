import collision from "polygon-collision";
function enemyCollision(weapon, enemy) {

    weapon.alreadyAttacked.push(enemy.id)
    enemy.damage(5)

}

//TODO: other name
function overlap(weapon, enemy) {
    // console.log(weapon)
    // console.log(enemy)
    // console.log("here")
    // console.log(collision(weapon.polygon, enemy.polygon)) 
    return collision(weapon.polygon, enemy.polygon) 
    && weapon.attacking 
    && !weapon.alreadyAttacked.includes(enemy.id)

}

module.exports = {
    enemyCollision,
    overlap
}