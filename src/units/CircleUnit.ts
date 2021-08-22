import { listenToAnim } from "../game/0_GameBase/engine/anim-listen";
import { initUnitAnims } from "../game/0_GameBase/engine/anim-play";
import { addID } from "../game/0_GameBase/engine/data";
import { damageable } from "../game/0_GameBase/engine/interfaces";
import { addToScene } from "../game/0_GameBase/engine/phaser";
import { CampID } from "../game/0_GameBase/setup/CampSetup";
import { HealthBar } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { ChainWeapon } from "../weapons/ChainWeapon/ChainWeapon";
import { EnemySize } from "./CircleFactory";

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
