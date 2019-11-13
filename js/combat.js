const attackQueue = []

function enemyCollision(weapon, enemy)
{  
    if(weapon.attacking&&!weapon.alreadyAttacked.includes(enemy.id))
    { 
        weapon.alreadyAttacked.push(enemy.id)
        enemy.damage(20)

    }
}
//TODO: enemy attack