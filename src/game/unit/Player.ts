import { UnitSetup } from "../setup/UnitSetup";
import { CampSetup, CampID } from "../setup/CampSetup";
import { healable } from "../base/interfaces";
import { Gameplay } from "../../scenes/Gameplay";
import { listenToAnim } from "../base/anim-listen";
import { ChainWeapon } from "../weapon/chain/weapon";
import { weaponHeights } from "../weapon/chain/data";
import { initUnitAnims, unitAnims } from "../base/anim-play";
import { EventSetup } from "../setup/EventSetup";
import { addID } from "../base/data";
import { addToScene, setupCircleBody } from "../base/phaser";

const playerTextureName = "blueNormalCircle";

export class Player extends Phaser.Physics.Arcade.Sprite implements healable, unitAnims {
	unitType: string = "player";
	type = "Normal";
	campID: CampID = CampSetup.playerCampID;
	// move back is needed for bounce
	stateHandler = { spotted: null, obstacle: null, moveBack: () => {} };

	id: string;
	scene: Gameplay;

	playIdle: Function;
	playDamage: Function;
	weaponPhysics: Phaser.Physics.Arcade.Sprite;
	attack: any;

	constructor(scene: Gameplay, x: number, y: number, private weapon: ChainWeapon) {
		super(scene, x, y, playerTextureName);

		addID(this);
		addToScene(this, scene);
		initUnitAnims(this);
		listenToAnim(this, { animComplete: true, damageComplete: this.playIdle.bind(this) });
		setupCircleBody(this);

		this.weaponPhysics = weapon.circle;
		this.attack = this.weapon.attack.bind(this.weapon);
	}

	setVelocityX(velo) {
		this.weapon.setVelocityX(velo);
		return super.setVelocityX(velo);
	}

	setVelocityY(velo) {
		this.weapon.setVelocityY(velo);
		return super.setVelocityY(velo);
	}

	heal(amount) {
		this.scene.events.emit(EventSetup.healPlayer, amount);
	}

	damage(amount) {
		this.playDamage();
		this.scene.events.emit(EventSetup.partialDamage + this.unitType, amount);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		// we dont need to set rotation by hand because we do it every frame here
		this.weapon.setRotationAroundOwner();
	}

	static withChainWeapon(scene: Phaser.Scene, x, y) {
		let weapon = new ChainWeapon(
			scene,
			x,
			y - UnitSetup.sizeDict["Normal"] - weaponHeights["Normal"].frame2 / 2,
			"NormalchainWeapon"
		);
		weapon.init("Normal", x, y - UnitSetup.sizeDict["Normal"] - weaponHeights["Normal"].frame2 / 2, 40);
		let circle = new Player(scene, x, y, weapon);
		weapon.setOwner(circle);

		//weapon.amount = 40000;

		return circle;
	}
}
