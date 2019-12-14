import { CampConfig } from "./camp";
import { EnemyCircle } from "./units/EnemyCircle";
import { PhysicGroups } from "../collision/Collision";
import { getRandomCampColorOrder } from "../../globals/global";
import { Gameplay } from "../../scenes/Gameplay";
import { ZeroOneMap } from "../base/types";
import { AreaConfig } from "../base/interfaces";

export function constructCampConfigs(
	scene: Gameplay,
	map: ZeroOneMap,
	areaConfigs: AreaConfig[],
	enemies: EnemyCircle[],
	physicGroups: PhysicGroups,
	pathDict
): CampConfig[] {
	let campConfigs: CampConfig[] = [];
	let colors = getRandomCampColorOrder();
	for (let index = 0, length = colors.length; index < length; index++) {
		let color = colors[index];
		let areaConfig = areaConfigs[index];
		let campConfig: CampConfig = {
			color,
			pathDict,
			enemies,
			map,
			areaConfig,
			staticConfig: { scene, physicsGroup: physicGroups.buildings[color] },
			enemyPhysicGroup: physicGroups.enemies[color],
			weaponPhysicGroup: physicGroups.enemyWeapons[color]
		};
		campConfigs.push(campConfig);
	}
	return campConfigs;
}
