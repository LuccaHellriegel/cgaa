import { Healer } from "../tower/healer/Healer";
import { Pool } from "./Pool";
import { Gameplay } from "../../scenes/Gameplay";
import { poolable } from "../base/interfaces";
import { Player } from "../unit/Player";

export class HealerPool extends Pool {
	constructor(
		scene: Gameplay,
		numberOfUnits: number,
		unitGroup: Phaser.Physics.Arcade.StaticGroup,
		private player: Player,
		private pools: Pool[]
	) {
		super(scene, numberOfUnits, unitGroup);
		this.init();
	}

	protected createNewUnit(): poolable {
		return new Healer(this.scene, -1000, -1000, this.unitGroup, this.player, this.pools.concat(this));
	}
}
