import { Gameplay } from "./gameplay"

function doDamage(weapon, enemy) {
    weapon.alreadyAttacked.push(enemy.id)
    enemy.damage(5)
}

function considerDamage(weapon, enemy) {
    return weapon.polygon.checkForCollision(enemy.polygon)
    && weapon.attacking 
    && !weapon.alreadyAttacked.includes(enemy.id)
}

function checkWeaponOverlap(scene: Gameplay){
    for (let index = 0; index < scene.enemies.length; index++) {
        let playerWeapon = scene.player.weapon
        let enemy = scene.enemies[index]
        let enemyWeapon = enemy.weapon
        if(considerDamage(playerWeapon, enemy)){
            doDamage(playerWeapon, enemy)
        }
        if(considerDamage(enemyWeapon,scene.player)){
            doDamage(enemyWeapon, scene.player)
        }
    }
}

export function updateFunc(scene: Gameplay) {
    scene.playerMovement.update()
    checkWeaponOverlap(scene)
}
