import { UnitSetup } from "../setup/UnitSetup";
import { CampSetup, CampID } from "../setup/CampSetup";
import { healable } from "../base/interfaces";
import { Gameplay } from "../../scenes/Gameplay";
import { listenToAnim } from "../base/anim-listen";
import { ChainWeapon } from "../weapon/chain/weapon";
import { weaponHeights } from "../weapon/chain/data";
import { ChainWeapons } from "../weapon/chain/group";
import { initUnitAnims, unitAnims } from "../base/anim-play";
import { EventSetup } from "../setup/EventSetup";

const playerTextureName = "blueNormalCircle";

export class Player extends Phaser.Physics.Arcade.Sprite implements healable, unitAnims {
	unitType: string;
	id: string;
	scene: Gameplay;
	campID: CampID;
	radius: number;
	stateHandler: { spotted: any; obstacle: any };

	playIdle: Function;
	playDamage: Function;

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		private weapon: ChainWeapon,
		physicsGroup: Phaser.Physics.Arcade.Group
	) {
		super(scene, x, y, playerTextureName);

		this.id = "_" + Math.random().toString(36).substr(2, 9);
		this.campID = CampSetup.playerCampID;
		this.weapon = weapon;
		this.unitType = "player";

		initUnitAnims(this);
		listenToAnim(this, { animComplete: true, damageComplete: this.playIdle.bind(this) });

		scene.add.existing(this);
		physicsGroup.add(this);

		this.radius = this.scene.textures.get(playerTextureName).get(0).halfHeight;
		this.setCircle(this.radius);

		this.type = "Normal";
		this.stateHandler = { spotted: null, obstacle: null };
	}

	setVelocityX(velo) {
		this.weapon.setVelocityX(velo);
		return super.setVelocityX(velo);
	}

	setVelocityY(velo) {
		this.weapon.setVelocityY(velo);
		return super.setVelocityY(velo);
	}

	heal() {
		//this.scene.events.emit(EventSetup.healPlayer, amount);
	}

	attack() {
		this.weapon.attack();
	}

	damage(amount) {
		this.scene.events.emit(EventSetup.partialDamage + this.unitType, amount);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		// we dont need to set rotation by hand because we do it every frame here
		this.weapon.setRotationAroundOwner();
	}

	static withChainWeapon(scene: Phaser.Scene, playerPhysicsGroup, group: ChainWeapons, x, y) {
		//TODO: might clash with the fact that all groups now are sizespecific
		let weapon = group.placeWeapon(x, y - UnitSetup.sizeDict["Normal"] - weaponHeights["Normal"].frame2 / 2);
		let circle = new Player(scene, x, y, weapon, playerPhysicsGroup);
		weapon.setOwner(circle);

		// weapon.amount = 40;
		//weapon.amount = 40000;

		return circle;
	}
}
