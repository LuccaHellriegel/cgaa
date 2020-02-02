import { Gameplay } from "../../../scenes/Gameplay";
import { ZeroOneMap, StaticConfig } from "../../base/types";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";
import { Enemies } from "../unit/Enemies";
import { getRandomCampColorOrder } from "../../base/globals/global";
import { Camp } from "./Camp";
import { Buildings } from "./building/Buildings";
import { Paths } from "../path/Paths";
import { Membership } from "../../base/classes/Membership";
import { PhysicGroups } from "../../collision/Collision";
import { removeEle } from "../../base/utils";
import { GameMap } from "../../base/GameMap";

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
	private activeCamps = [];

	constructor(
		private scene: Gameplay,
		map: ZeroOneMap,
		areaConfigs: AreaConfig[],
		physicGroups: PhysicGroups,
		enemies: Enemies,
		paths: Paths,
		membership: Membership,
		factories,
		gameMap: GameMap
	) {
		let configs = this.constructCampConfigs(scene, map, areaConfigs, physicGroups);
		for (let index = 0, length = configs.length; index < length; index++) {
			this.camps.push(new Camp(configs[index], enemies, paths, membership, factories[configs[index].color], gameMap));
		}
		this.camps.forEach(camp => this.activeCamps.push(camp.buildings.color));
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
		return this.camps.map(camp => camp.buildings);
	}

	getBuildingInfos(): BuildingInfo[] {
		return this.camps.map(camp => camp.buildings.getBuildingInfo());
	}

	anyHostileCampsLeft() {
		return this.camps.reduce((prev, cur) => prev || cur.isHostile(), false);
	}

	setNonHostile(campID) {
		for (const camp of this.camps) {
			if (camp.id === campID) {
				camp.hostile = false;
				break;
			}
		}

		if (!this.anyHostileCampsLeft()) {
			this.scene.events.emit("camps-conquered");
		}
	}

	private updateActiveCamps() {
		for (let index = 0; index < this.activeCamps.length; index++) {
			if (this.camps[index].buildings.areDestroyed()) {
				removeEle(this.camps[index], this.camps);
				removeEle(this.activeCamps[index], this.activeCamps);
			}
		}
	}

	getNextActiveCampColor() {
		this.updateActiveCamps();

		if (this.activeCamps.length === 0) {
			//TODO: waiting for next CampState tick is too long
			this.scene.events.emit("camps-conquered");
			return false;
		}

		let nextColor = this.activeCamps.pop();
		this.activeCamps.unshift(nextColor);

		//TODO: make different implementation, state mutation is dangerous here
		let nextBuildings = this.camps.pop();
		this.camps.unshift(nextBuildings);

		return nextColor;
	}
}
