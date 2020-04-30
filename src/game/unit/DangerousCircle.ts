import { poolable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { CircleControl } from "../ai/CircleControl";
import { Point } from "../base/types";
import { EnemySize } from "./CircleFactory";
import { Gameplay } from "../../scenes/Gameplay";
import { CampID } from "../setup/CampSetup";
import { ChainWeapon } from "../weapon/chain/weapon";
import { UnitSetup } from "../setup/UnitSetup";
import { weaponHeights } from "../weapon/chain/data";
import { unitAnims } from "../base/anim-play";
import { setupCircleBody } from "../base/phaser";
import { CircleUnit } from "./CircleUnit";

export class DangerousCircle extends CircleUnit implements poolable, unitAnims {
	pathArr: Point[];
	stateHandler: CircleControl = new CircleControl(this);

	attack: Function;

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
		super(scene, x, y, texture, campID, weapon, size, healthbar);
		setupCircleBody(this);
		this.attack = this.weapon.attack.bind(this.weapon);
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
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
