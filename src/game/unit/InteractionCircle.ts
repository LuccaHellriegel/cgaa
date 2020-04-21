import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { EnvSetup } from "../setup/EnvSetup";
import { EventSetup } from "../setup/EventSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { CampID } from "../setup/CampSetup";
import { EnemySize } from "./CircleFactory";
import { ChainWeapon } from "../weapon/chain/weapon";
import { setupCircle } from "../base/circle";
import { listenToAnim } from "../base/anim-listen";

export class InteractionCircle extends Phaser.Physics.Arcade.Sprite implements damageable {
	weapon: ChainWeapon;
	unitType: string;
	id: string;
	scene: Gameplay;
	campID: CampID;
	healthbar: HealthBar;
	stateHandler = { spotted: null, obstacle: null };

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		texture: string,
		campID: CampID,
		weapon: ChainWeapon,
		physicsGroup: Phaser.Physics.Arcade.Group,
		size: EnemySize,
		healthbar: HealthBar
	) {
		super(scene, x, y, texture);

		this.id = "_" + Math.random().toString(36).substr(2, 9);

		listenToAnim(this, { animComplete: true, damageComplete: this.damageFinished.bind(this) });

		scene.add.existing(this);
		physicsGroup.add(this);
		setupCircle(this);

		this.campID = campID;
		this.unitType = "circle";
		this.weapon = weapon;
		this.healthbar = healthbar;
		this.setImmovable(true);
		this.setSize(EnvSetup.gridPartSize, EnvSetup.gridPartSize);

		//Needed for gaining souls
		this.type = size;
	}

	damageFinished() {
		this.anims.play("idle-" + this.texture.key);
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			this.destroy();
		} else {
			this.anims.play("damage-" + this.texture.key);
		}
	}

	destroy() {
		EventSetup.destroyInteractionCircle(this.scene, this.campID);
		super.destroy();
		this.healthbar.bar.destroy();
		this.weapon.destroy();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.weapon.setRotationAroundOwner(this.rotation);
		this.healthbar.move(this.x, this.y);
	}
}
