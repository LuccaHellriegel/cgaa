import { EnemyCircle } from "../../enemies/unit/EnemyCircle";

export function addToInactivePool(scene, enemyCircle: EnemyCircle) {
	scene.events.emit("inactive-" + enemyCircle.id, enemyCircle.id);
}
