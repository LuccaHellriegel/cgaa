import { Gameplay } from "../../scenes/Gameplay";
import { damageable } from "../base/interfaces";
import { CampID } from "../setup/CampSetup";
import { ChainWeapon } from "../weapon/chain/weapon";
import { EnemySize } from "./CircleFactory";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { addID } from "../base/data";
import { addToScene } from "../base/phaser";
import { initUnitAnims } from "../base/anim-play";
import { listenToAnim } from "../base/anim-listen";

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
