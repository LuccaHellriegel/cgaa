import { CircleUnit } from "./CircleUnit";
import { ChainWeapon } from "../weapon/ChainWeapon";
import { weaponHeights } from "../../0_GameBase/weapon/chain-weapon-data";
import { poolable } from "../../0_GameBase/engine/interfaces";
import { unitAnims } from "../../0_GameBase/engine/anim-play";
import { Point } from "../../0_GameBase/engine/types-geom";
import { CircleControl } from "../ai/CircleControl";
import { Gameplay } from "../../../scenes/Gameplay";
import { CampID } from "../../0_GameBase/setup/CampSetup";
import { EnemySize } from "./CircleFactory";
import { HealthBar } from "../healthbar/HealthBar";
import { setupCircleBody } from "../../0_GameBase/engine/phaser";
import { UnitSetup } from "../../0_GameBase/setup/UnitSetup";

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
