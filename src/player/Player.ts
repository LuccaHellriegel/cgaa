import { CampID, CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { UnitSetup } from "../config/UnitSetup";
import { listenToAnim } from "../engine/anim-listen";
import { unitAnims, initUnitAnims } from "../engine/anim-play";
import { addID } from "../engine/id";
import { healable } from "../engine/interfaces";
import { addToScene, setupCircleBody } from "../engine/phaser";
import { Gameplay } from "../scenes/Gameplay";
import { weaponHeights } from "../weapons/ChainWeapon/chain-weapon-data";
import { ChainWeapon } from "../weapons/ChainWeapon/ChainWeapon";

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

		//DEV: weapon.amount = 40000;

		return circle;
	}
}
