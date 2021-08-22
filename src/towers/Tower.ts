import { damageable, poolable, healable } from "../game/0_GameBase/engine/interfaces";
import { IClickableElement } from "../game/0_GameBase/engine/ui/modes/IClickableElement";
import { HealthBar } from "../healthbar/HealthBar";
import { CampID } from "../game/0_GameBase/setup/CampSetup";
import { MouseOver } from "../game/0_GameBase/engine/ui/MouseOver";

export abstract class Towers extends Phaser.Physics.Arcade.StaticGroup {
	constructor(scene, protected addTowerToPhysics: Function) {
		super(scene.physics.world, scene);
	}

	getActiveUnits() {
		return this.getChildren().filter((child) => child.active);
	}

	abstract placeTower(x, y): Tower;
}

//TODO: make Tower that Spawns Units that walk to boss (? walking to dynamic positions might be to complicated)
export abstract class Tower
	extends Phaser.Physics.Arcade.Image
	implements damageable, poolable, healable, IClickableElement
{
	healthbar: HealthBar;
	id: string;
	campID: CampID;
	mouseOver = false;

	constructor(scene: Phaser.Scene, x, y, texture) {
		super(scene, x, y, texture);
		this.campID = "blue";
		scene.physics.add.existing(this);
	}

	abstract damage(amount: number);

	abstract poolDestroy();

	place(x, y, _) {
		if (!this.healthbar)
			this.healthbar = new HealthBar(x, y, {
				scene: this.scene,
				posCorrectionX: -26,
				posCorrectionY: -40,
				healthWidth: 46,
				healthLength: 12,
				value: 100,
			});
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

	makeClickable(onClickCallback) {
		this.setInteractive();
		this.on("pointerdown", onClickCallback);
		new MouseOver(this, this);
	}
}
