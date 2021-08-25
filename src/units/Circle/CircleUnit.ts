import { CampID } from "../../config/CampSetup";
import { listenToAnim } from "../../engine/anim-listen";
import { initUnitAnims } from "../../engine/anim-play";
import { addID } from "../../engine/id";
import { damageable } from "../../engine/interfaces";
import { addToScene } from "../../engine/phaser";
import { HealthBar } from "../../healthbar/HealthBar";
import { Gameplay } from "../../scenes/Gameplay";
import { ChainWeapon } from "../../weapons/ChainWeapon/ChainWeapon";
import { EnemySize } from "../CircleFactory";

export class CircleUnit extends Phaser.Physics.Arcade.Sprite implements damageable {
	unitType: string;
	id: string;
	scene: Gameplay;

	playIdle: Function;
	playDamage: Function;
	weaponPhysics: Phaser.Physics.Arcade.Sprite;

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		texture: string,
		public campID: CampID,
		public campMask: number,
		public weapon: ChainWeapon,
		size: EnemySize,
		public healthbar: HealthBar
	) {
		super(scene, x, y, texture);
		addID(this);
		addToScene(this, scene);
		initUnitAnims(this);
		listenToAnim(this, { animComplete: true, damageComplete: this.playIdle.bind(this) });

		this.unitType = "circle";
		//Needed for gaining souls
		this.type = size;

		this.weaponPhysics = weapon.circle;
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			this.destroy();
		} else {
			this.playDamage();
		}
	}

	destroy() {
		this.weapon.destroy();
		this.healthbar.destroy();
		super.destroy();
	}
}
