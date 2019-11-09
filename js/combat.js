function enemyCollision(player, enemy)
{
    enemy.damage(10)
    if(enemy.hp.value <= 0){
    enemy.destroy()
    }
   
}