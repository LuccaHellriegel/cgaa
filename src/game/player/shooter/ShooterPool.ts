import { Gameplay } from "../../../scenes/Gameplay";
import { Shooter } from "./Shooter";
import { gainSouls } from "../../base/events/player";
import { shooterCost } from "../../base/globals/globalConfig";
import { removeEle } from "../../base/utils";

interface ShooterPoolParams {
	scene: Gameplay;
	numberOfShooters: number;
	shooterGroup: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Phaser.Physics.Arcade.Group;
}

export class ShooterPool {
	shooterDict = {};
	activeIDArr: string[] = [];
	inactiveIDArr: string[] = [];
	params: ShooterPoolParams;

	constructor(params: ShooterPoolParams) {
		this.initPool(params);

		let keys = Object.keys(this.shooterDict);
		for (const key in keys) {
			params.scene.events.on("inactive-" + key, id => {
				removeEle(id, this.activeIDArr);
				this.inactiveIDArr.push(id);
			});
		}

		this.params = params;
	}

	private initPool(params: ShooterPoolParams) {
		for (let index = 0; index < params.numberOfShooters; index++) {
			let shooter = new Shooter(params.scene, -1000, -1000, params.shooterGroup, params.bulletGroup);
			shooter.poolDestroy();
			this.shooterDict[shooter.id] = shooter;
			this.inactiveIDArr.push(shooter.id);
		}
	}

	pop(): Shooter {
		if (this.inactiveIDArr.length === 0) {
			this.initPool(this.params);
		}
		let id = this.inactiveIDArr.pop();
		this.activeIDArr.push(id);
		return this.shooterDict[id];
	}

	getActiveShooters() {
		return this.activeIDArr.map(id => this.shooterDict[id]);
	}
}
