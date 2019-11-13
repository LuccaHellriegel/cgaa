function enemyCollision(weapon, enemy)
{  
    if(weapon.attacking&&!weapon.alreadyAttacked.includes(enemy.id))
    { 
        weapon.alreadyAttacked.push(enemy.id)
        enemy.damage(5)

    }
}
