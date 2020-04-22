import { generateTextures } from "../graphics/texture/texture";
import { createAnims } from "../graphics/animation/animation";
import { Player } from "../game/unit/Player";
import { Movement } from "../game/input/Movement";
import { WASD } from "../game/input/WASD";
import { weaponTextures } from "../game/weapon/chain/texture";
import { UnitSetup } from "../game/setup/UnitSetup";
import { SelectorRect } from "../game/modi/SelectorRect";
import { MouseMovement } from "../game/input/MouseMovement";
import { weaponHeights } from "../game/weapon/chain/data";
import { ChainWeapons } from "../game/weapon/chain/group";
import { DangerousCircle } from "../game/unit/DangerousCircle";
import { HealthBarFactory } from "../game/ui/healthbar/HealthBarFactory";
import { GuardComponent } from "../game/ai/GuardComponent";
import { Rivalries } from "../game/state/Rivalries";
import { CampRouting } from "../game/camp/CampRouting";
import { Cooperation } from "../game/state/Cooperation";
import { addCollision } from "../game/physics/physics";
import { CampSetup } from "../game/setup/CampSetup";

export class Develop extends Phaser.Scene {
	movement: Movement;
	player: Player;

	constructor() {
		super("Develop");
	}

	preload() {
		weaponTextures(this);
		generateTextures(this);
		createAnims(this.anims);

		this.add.circle(0, 0, 5, 0xfffff);
	}

	create() {
		let rivalries = new Rivalries();
		let router = new CampRouting(this.events, rivalries);
		let cooperation = new Cooperation(this, router, rivalries);
		let physicsGroups = addCollision(this, cooperation);

		this.cameras.main.centerOn(0, 50);
		this.player = Player.withChainWeapon(this, physicsGroups.player, physicsGroups.playerWeapon, 200, 400);
		this.movement = new Movement(new WASD(this), this.player);
		this.cameras.main.startFollow(this.player);
		let selectorRect = new SelectorRect(this, 0, 0);
		new MouseMovement(this, this.player, selectorRect);

		this.input.on("pointerdown", this.player.weapon.attack.bind(this.player.weapon));

		for (let index = 0; index < 10; index++) {
			let weapon = (physicsGroups.enemyWeapons[CampSetup.bossCampID]["Big"] as ChainWeapons).placeWeapon(
				100,
				100 - UnitSetup.sizeDict["Big"] - weaponHeights["Big"].frame2 / 2
			);
			let circle = new DangerousCircle(
				this,
				100 + index * 100,
				100,
				"orangeBigCircle",
				"orange",
				weapon,
				physicsGroups.enemies[CampSetup.bossCampID],
				"Big",
				HealthBarFactory.createDangerousCircleHealthBar(this, 100, 100, "Big"),
				10
			);
			circle.stateHandler.setComponents([new GuardComponent(circle, circle.stateHandler)]);
			weapon.setOwner(circle);
		}
	}

	update() {
		this.movement.update();
	}
}
