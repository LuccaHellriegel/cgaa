import { EnemyCircle } from "./EnemyCircle";
import { Point } from "../../base/types";

export class Enemies {
	private idDict = {};
	constructor() {}

	addEnemy(enemy: EnemyCircle) {
		this.idDict[enemy.id] = enemy;
	}

	getAllEnemyPositions() {
		return this.getEnemyPositions(Object.keys(this.idDict));
	}

	getEnemyPositions(ids): Point[] {
		let positions: Point[] = [];
		for (let index = 0; index < ids.length; index++) {
			positions.push({ x: this.idDict[ids[index]].x, y: this.idDict[ids[index]].y });
		}

		return positions;
	}

	getEnemy(id) {
		return this.idDict[id];
	}

	destroyEnemies(ids) {
		ids.forEach(id => this.idDict[id].destroy());
	}
}
