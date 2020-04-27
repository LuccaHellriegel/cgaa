import { initCollision } from "../game/physics/physics";
import { Rivalries } from "../game/state/Rivalries";
import { CampRouting } from "../game/camp/CampRouting";
import { Cooperation } from "../game/state/Cooperation";
import { initPools } from "../game/pool/pools";

export class Develop extends Phaser.Scene {
	constructor() {
		super("Develop");
	}

	preload() {
		// weaponTextures(this);
		// generateTextures(this);
		// createAnims(this.anims);
		// this.add.circle(0, 0, 5, 0xfffff);
	}

	create() {
		let rivalries = new Rivalries();
		let router = new CampRouting(this.events, rivalries);
		let cooperation = new Cooperation(this, router, rivalries);
		initCollision(this, cooperation);
		initPools(this);
		//oneGroup(this);
		// let physicsGroups = addCollision(this, cooperation);
		// this.cameras.main.centerOn(0, 50);
		// this.player = Player.withChainWeapon(
		// 	this,
		// 	this.physics.add.group(),
		// 	new ChainWeapons(this, "Normal", 20, this.physics.add.group()),
		// 	200,
		// 	400
		// );
		// this.movement = new Movement(new WASD(this), this.player);
		// this.cameras.main.startFollow(this.player);
		// let selectorRect = new SelectorRect(this, 0, 0);
		// new MouseMovement(this, this.player, selectorRect);
		//this.input.on("pointerdown", this.player.weapon.attack.bind(this.player.weapon));
		// for (let index = 0; index < 10; index++) {
		// 	let weapon = (physicsGroups.enemyWeapons[CampSetup.bossCampID]["Big"] as ChainWeapons).placeWeapon(
		// 		100,
		// 		100 - UnitSetup.sizeDict["Big"] - weaponHeights["Big"].frame2 / 2
		// 	);
		// 	let circle = new DangerousCircle(
		// 		this,
		// 		100 + index * 100,
		// 		100,
		// 		"orangeBigCircle",
		// 		"orange",
		// 		weapon,
		// 		physicsGroups.enemies[CampSetup.bossCampID],
		// 		"Big",
		// 		HealthBarFactory.createDangerousCircleHealthBar(this, 100, 100, "Big"),
		// 		10
		// 	);
		// 	circle.stateHandler.setComponents([new GuardComponent(circle, circle.stateHandler)]);
		// 	weapon.setOwner(circle);
		// }
	}

	update() {
		//this.movement.update();
	}
}
