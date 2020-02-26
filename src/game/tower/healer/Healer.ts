import { Tower } from "../Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { Player } from "../../unit/Player";
import { Pool } from "../../pool/Pool";
import { TowerSetup } from "../../setup/TowerSetup";

export class Healer extends Tower {
	healIntervalID: number;

	constructor(scene: Gameplay, x, y, physicsGroup, private player: Player, private pools: Pool[]) {
		//TODO: modify texture so its obvious we can only heal down and right
		//TODO: maybe just heal downward? Or maybe better: only right, because of the layout
		//TODO: much more expensive -> healUnits is to computationally expensive
		super(scene, x, y, "healer", physicsGroup);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			this.poolDestroy();
		}
	}

	inDistance(unit) {
		return Phaser.Math.Distance.Between(this.x, this.y, unit.x, unit.y) < TowerSetup.towerDistance;
	}

	healUnits() {
		this.pools.forEach(pool =>
			pool.getActiveUnits().forEach(unit => {
				if (this.inDistance(unit)) {
					unit.heal(TowerSetup.singleHealAmount);
					console.log("Healing unit");
				}
			})
		);

		if (this.inDistance(this.player)) this.player.heal(TowerSetup.singleHealAmount);
	}

	deactivate() {
		if (this.healIntervalID) clearInterval(this.healIntervalID);
	}

	activate() {
		this.healIntervalID = setInterval(this.healUnits.bind(this), 10000);
	}

	poolDestroy() {
		this.scene.events.emit("inactive-" + this.id, this.id);
		this.disableBody(true, true);
		this.setPosition(-1000, -1000);
		this.healthbar.bar.setActive(false).setVisible(false);
		this.healthbar.value = this.healthbar.defaultValue;
		this.deactivate();
	}

	poolActivate(x, y) {
		this.enableBody(true, x, y, true, true);
		this.healthbar.bar.setActive(true).setVisible(true);
		this.healthbar.move(x, y);
		this.activate();
	}
}
