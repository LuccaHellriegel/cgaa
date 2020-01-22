import { Gameplay } from "../../../scenes/Gameplay";
import { ZeroOneMap, StaticConfig } from "../../base/types";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";
import { PhysicGroups } from "../../collision/collisionBase";
import { Enemies } from "../unit/Enemies";
import { getRandomCampColorOrder } from "../../base/globals/global";
import { Camp } from "./Camp";
import { Buildings } from "./building/Buildings";
import { Paths } from "../path/Paths";
import { Membership } from "../../base/classes/Membership";

export interface CampConfig {
	staticConfig: StaticConfig;
	map: ZeroOneMap;
	areaConfig: AreaConfig;
	color: string;
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
}

export class Camps {
	private camps: Camp[] = [];

	constructor(
		scene: Gameplay,
		map: ZeroOneMap,
		areaConfigs: AreaConfig[],
		physicGroups: PhysicGroups,
		enemies: Enemies,
		paths: Paths,
		membership: Membership
	) {
		let configs = this.constructCampConfigs(scene, map, areaConfigs, physicGroups);
		for (let index = 0, length = configs.length; index < length; index++) {
			this.camps.push(new Camp(configs[index], enemies, paths, membership));
		}
	}
	private constructCampConfigs(
		scene: Gameplay,
		map: ZeroOneMap,
		areaConfigs: AreaConfig[],
		physicGroups: PhysicGroups
	): CampConfig[] {
		let campConfigs: CampConfig[] = [];
		let colors = getRandomCampColorOrder();
		for (let index = 0, length = colors.length; index < length; index++) {
			let color = colors[index];
			let areaConfig = areaConfigs[index];
			let campConfig: CampConfig = {
				color,
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

	getBuildings(): Buildings[] {
		return this.camps.map(camp => camp.campBuildings);
	}

	getBuildingInfos(): BuildingInfo[] {
		return this.camps.map(camp => camp.campBuildings.getBuildingInfo());
	}
}
