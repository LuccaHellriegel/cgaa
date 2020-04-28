import { damageable, healable } from "../base/interfaces";
import { poolable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { CampID } from "../setup/CampSetup";

export abstract class Towers extends Phaser.Physics.Arcade.StaticGroup {
	constructor(scene, protected addTowerToPhysics: Function) {
		super(scene.physics.world, scene);
	}

	getActiveUnits() {
		return this.getChildren().filter((child) => child.active);
	}

	getActiveElements() {
		return this.getActiveUnits();
	}

	abstract placeTower(x, y);
}

//TODO: make Tower that Spawns Units that walk to boss (? walking to dynamic positions might be to complicated)
export abstract class Tower extends Phaser.Physics.Arcade.Image implements damageable, poolable, healable {
	healthbar: HealthBar;
	id: string;
	campID: CampID;

	constructor(scene: Phaser.Scene, x, y, texture) {
		super(scene, x, y, texture);
		this.campID = "blue";
		scene.physics.add.existing(this);
	}

	abstract damage(amount: number);

	abstract poolDestroy();

	place(x, y, _) {
		if (!this.healthbar) this.healthbar = HealthBarFactory.createTowerHealthBar(this.scene, x, y);
		this.enableBody(true, x, y, true, true);
		this.healthbar.bar.setActive(true).setVisible(true);
		this.healthbar.move(x, y);
		this.setImmovable(true);
	}

	destroy() {
		this.healthbar.destroy();
		super.destroy();
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
	}
}
