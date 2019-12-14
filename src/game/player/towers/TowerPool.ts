import { Gameplay } from "../../../scenes/Gameplay";
import { Tower } from "./Tower";
import { gainSouls } from "../../base/events/player";
import { towerCost } from "../../base/globals/globalConfig";

interface TowerPoolParams {
	scene: Gameplay;
	numberOfTowers: number;
	towerGroup: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Phaser.Physics.Arcade.Group;
}

export class TowerPool {
	towerDict = {};
	activeIDArr: string[] = [];
	inactiveIDArr: string[] = [];
	params: TowerPoolParams;

	constructor(params: TowerPoolParams) {
		this.initPool(params);

		let keys = Object.keys(this.towerDict);
		for (const key in keys) {
			params.scene.events.on("inactive-" + key, id => {
				let index = this.activeIDArr.indexOf(id);
				this.activeIDArr.splice(index, 1);
				this.inactiveIDArr.push(id);
			});
		}

		params.scene.events.on("sold-tower", tower => {
			tower.destroy();
			gainSouls(params.scene, towerCost);
		});

		this.params = params;
	}

	private initPool(params: TowerPoolParams) {
		for (let index = 0; index < params.numberOfTowers; index++) {
			let tower = new Tower(params.scene, -1000, -1000, params.towerGroup, params.bulletGroup);
			tower.destroy();
			this.towerDict[tower.id] = tower;
			this.inactiveIDArr.push(tower.id);
		}
	}

	pop(): Tower {
		if (this.inactiveIDArr.length === 0) {
			this.initPool(this.params);
		}
		let id = this.inactiveIDArr.pop();
		this.activeIDArr.push(id);
		return this.towerDict[id];
	}
}
