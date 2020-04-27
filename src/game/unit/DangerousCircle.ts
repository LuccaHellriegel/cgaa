import { damageable, poolable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { CircleControl } from "../ai/CircleControl";
import { Point } from "../base/types";
import { EnemySize } from "./CircleFactory";
import { Gameplay } from "../../scenes/Gameplay";
import { CampID } from "../setup/CampSetup";
import { ChainWeapon } from "../weapon/chain/weapon";
import { setupCircle } from "../base/circle";
import { UnitSetup } from "../setup/UnitSetup";
import { weaponHeights } from "../weapon/chain/data";
import { listenToAnim } from "../base/anim-listen";
import { unitAnims, initUnitAnims } from "../base/anim-play";

export class DangerousCircle extends Phaser.Physics.Arcade.Sprite implements damageable, poolable, unitAnims {
	healthbar: HealthBar;
	pathArr: Point[];
	stateHandler: CircleControl;
	weapon: ChainWeapon;
	unitType: string;
	id: string;
	scene: Gameplay;
	campID: CampID;

	playIdle: Function;
	playDamage: Function;

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		texture: string,
		campID: CampID,
		weapon: ChainWeapon,
		size: EnemySize,
		healthbar: HealthBar,
		public velo: number
	) {
		super(scene, x, y, texture);
		this.id = "_" + Math.random().toString(36).substr(2, 9);

		initUnitAnims(this);
		listenToAnim(this, { animComplete: true, damageComplete: this.playIdle.bind(this) });

		scene.add.existing(this);
		this.campID = campID;
		this.unitType = "circle";
		this.weapon = weapon;

		this.weaponPhysics = weapon.circle;

		// setupCircle(this)

		this.healthbar = healthbar;
		this.stateHandler = new CircleControl(this);

		//Needed for gaining souls
		this.type = size;
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			this.poolDestroy();
		} else {
			this.playDamage();
		}
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
	}

	attack() {
		this.weapon.attack();
	}

	destroy() {
		super.destroy();
		this.weapon.destroy();
		this.healthbar.bar.destroy();
	}

	disable() {
		this.scene.events.emit("inactive-" + this.id, this.id);
		this.disableBody(true, true);
		this.setPosition(-1000, -1000);
	}

	enable(x, y) {
		this.enableBody(true, x, y, true, true);
		this.stateHandler.lastPositions.push({ x, y });
	}

	poolDestroy() {
		this.disable();
		this.healthbar.disable();
		this.weapon.disable();
	}

	poolActivate(x, y) {
		this.enable(x, y);
		this.healthbar.enable(x, y);
		this.weapon.enable(x, y - UnitSetup.sizeDict[this.type] - weaponHeights[this.type].frame2 / 2);
	}

	setVelocityX(velo) {
		this.weapon.setVelocityX(velo);
		return super.setVelocityX(velo);
	}

	setVelocityY(velo) {
		this.weapon.setVelocityY(velo);
		return super.setVelocityY(velo);
	}

	setVelocity(x, y) {
		this.weapon.setVelocity(x, y);
		return super.setVelocity(x, y);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.weapon.setRotationAroundOwner();
		this.healthbar.move(this.x, this.y);
		this.stateHandler.tick();
	}
}
