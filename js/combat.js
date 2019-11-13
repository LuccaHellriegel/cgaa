const attackQueue = []

function enemyCollision(weapon, enemy)
{
    if(weapon.attacking) enemy.damage(2)
}

//TODO: enemy attack