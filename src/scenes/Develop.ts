import { initCollision } from "../game/physics/physics";
import { CampRouting } from "../game/camp/CampRouting";
import { initPools } from "../game/pool/pools";
import { Player } from "../game/unit/Player";
import { Movement } from "../game/input/Movement";
import { WASD } from "../game/input/WASD";
import { weaponTextures } from "../game/weapon/chain/texture";
import { generateTextures } from "../graphics/texture/texture";
import { createAnims } from "../graphics/animation/animation";
import { SelectorRect } from "../game/modi/SelectorRect";
import { MouseMovement } from "../game/input/MouseMovement";
import { DangerousCircle } from "../game/unit/DangerousCircle";
import { ChainWeapon } from "../game/weapon/chain/weapon";
import { CircleFactory } from "../game/unit/CircleFactory";
import { Enemies } from "../game/unit/Enemies";
import { GuardComponent } from "../game/ai/GuardComponent";

export class Develop extends Phaser.Scene {
	movement: any;
	selectorRect: SelectorRect;
	constructor() {
		super("Develop");
	}

	preload() {
		weaponTextures(this);
		generateTextures(this);
		createAnims(this.anims);
		//this.add.circle(0, 0, 5, 0xfffff);
	}

	create() {
		let rivalries = initRivalries();
		let router = new CampRouting(this.events, rivalries);
		let cooperation = new Cooperation(this, router, rivalries);
		let collision = initCollision(this, cooperation);
		let player = Player.withChainWeapon(this, 0, 0);
		collision.addUnit(player);
		this.cameras.main.startFollow(player);
		this.movement = new Movement(new WASD(this), player);

		this.selectorRect = new SelectorRect(this, 0, 0);

		new MouseMovement(this, player, this.selectorRect);

		let pools = initPools(this);
		let factory = new CircleFactory(this, "yellow", collision.addUnit, new Enemies(), pools.weapons["yellow"]);
		let enemy = factory.createEnemy("Big");
		enemy.stateHandler.setComponents([new GuardComponent(enemy, enemy.stateHandler)]);
		// enemy.preUpdate = function (time, delta) {
		// 	this.weapon.setRotationAroundOwner();
		// 	this.healthbar.move(this.x, this.y);
		// }.bind(enemy);
		enemy.setPosition(100, 0);

		this.input.on("pointerdown", player.attack.bind(player));
	}

	update() {
		this.movement.update();
	}
}
