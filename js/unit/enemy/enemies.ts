import { EnemyCircle } from "./EnemyCircle";

export function spawnRedEnemyCircles(scene, count) {
    const enemies = []
    const enemyPhysics = scene.physics.add.group();
    const enemyWeapons = scene.physics.add.group();   

    for (let index = 0; index < count; index++) {
        enemies.push(new EnemyCircle(scene, (index * 70) + 120, 200,  "redCircle", enemyPhysics, enemyWeapons))
    }
    return enemies
}
