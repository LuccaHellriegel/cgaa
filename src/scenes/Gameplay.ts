import { createAnims } from "../graphics/animation/animation";
import { generateTextures } from "../graphics/texture/texture";
import { Movement } from "../game/player/input/move/Movement";
import { Player } from "../game/player/unit/Player";
import { InteractionModus } from "../game/player/modi/interaction/InteractionModus";
import { SelectorRect } from "../game/player/modi/SelectorRect";
import { Modi } from "../game/player/modi/Modi";
import { createAreas, constructAreaConfigs } from "../game/area/area";
import { StaticConfig } from "../game/base/types";
import { Collision } from "../game/collision/Collision";
import { campColors } from "../game/base/globals/globalColors";
import { WASD } from "../game/player/input/move/WASD";
import { WaveController } from "../game/enemies/wave/WaveController";
import { CampsState } from "../game/enemies/camp/CampsState";
import { Mouse } from "../game/player/input/move/Mouse";
import { Enemies } from "../game/enemies/unit/Enemies";
import { Camps } from "../game/enemies/camp/Camps";
import { Rerouter } from "../game/enemies/path/Rerouter";
import { Rivalries } from "../game/enemies/camp/Rivalries";
import { Cooperation } from "../game/player/state/Cooperation";
import { Quests } from "../game/player/state/Quest";
import { Paths } from "../game/enemies/path/Paths";
import { PathFactory } from "../game/enemies/path/PathFactory";
import EasyStar from "easystarjs";
import { Exits } from "../game/enemies/path/Exits";
import { ShooterPool } from "../game/player/unit/shooter/ShooterPool";
import { BuildModus } from "../game/player/modi/build/BuildModus";
import { ElementCollection } from "../game/base/classes/ElementCollection";
import { Membership } from "../game/base/classes/Membership";
import { ShooterSpawnObj } from "../game/base/spawn/ShooterSpawnObj";
import { Spawner } from "../game/base/pool/Spawner";
import { HealerPool } from "../game/player/unit/healer/HealerPool";
import { Inputs } from "../game/player/input/Inputs";

export class Gameplay extends Phaser.Scene {
	cgaa;

	constructor() {
		super("Gameplay");
	}

	preload() {
		generateTextures(this);
		createAnims(this.anims);
	}

	private initCGAA() {
		this.cgaa = {
			interactionCol: new ElementCollection("interaction"),
			essentialCol: new ElementCollection("essential")
		};
		this.cgaa.membership = new Membership([this.cgaa.interactionCol, this.cgaa.essentialCol]);
		this.cgaa.camps = campColors.reduce((prev, cur) => {
			prev[cur] = { dontAttackList: [] };
			return prev;
		}, {});
	}

	private initPhysics() {
		this.cgaa.physicsGroups = new Collision(this).physicGroups;
	}

	private initEnvironment() {
		let areaStaticConfig: StaticConfig = { scene: this, physicsGroup: this.cgaa.physicsGroups.areas };
		this.cgaa.areaConfigs = constructAreaConfigs(areaStaticConfig);
		let { unifiedMap, middlePos } = createAreas(this.cgaa.areaConfigs);
		this.cgaa.unifiedMap = unifiedMap;
		this.cgaa.middlePos = middlePos;
	}

	private initEnemies() {
		this.cgaa.enemies = new Enemies();
		this.cgaa.rivalries = new Rivalries();
		this.cgaa.rerouter = new Rerouter(this.events, this.cgaa.rivalries);
		this.cgaa.paths = new Paths(this.cgaa.rerouter);

		this.cgaa.campsObj = new Camps(
			this,
			this.cgaa.unifiedMap,
			this.cgaa.areaConfigs,
			this.cgaa.physicsGroups,
			this.cgaa.enemies,
			this.cgaa.paths,
			this.cgaa.membership
		);

		new PathFactory(
			this.cgaa.unifiedMap,
			new EasyStar.js(),
			this.cgaa.paths,
			new Exits(this.cgaa.areaConfigs),
			this.cgaa.middlePos
		).generatePaths(this.cgaa.campsObj.getBuildingInfos());
	}

	private initPlayerUnitAndColleagues() {
		this.cgaa.player = Player.withChainWeapon(
			this,
			this.cgaa.physicsGroups.player,
			this.cgaa.physicsGroups.playerWeapon
		);
		this.cameras.main.startFollow(this.cgaa.player);
	}

	private initKeyboard() {
		this.cgaa.movement = new Movement(new WASD(this), this.cgaa.player);
	}

	private initShooters() {
		this.cgaa.selectorRect = new SelectorRect(this, 0, 0);

		const shooterPool = new ShooterPool(
			this,
			15,
			this.cgaa.physicsGroups.shooter,
			this.cgaa.physicsGroups.shooterBulletGroup
		);
		shooterPool.init();

		this.cgaa.shooterSpawner = Spawner.createShooterSpawner(
			this,
			shooterPool,
			ShooterSpawnObj.createShooterSpawnObj(this.cgaa.unifiedMap, this.cgaa.areaConfigs, this.cgaa.enemies)
		);

		this.cgaa.healerSpawner = Spawner.createHealerSpawner(
			this,
			new HealerPool(this, 15, this.cgaa.physicsGroups.shooter, this.cgaa.physicsGroups.healer),
			ShooterSpawnObj.createShooterSpawnObj(this.cgaa.unifiedMap, this.cgaa.areaConfigs, this.cgaa.enemies)
		);
	}

	private initPlayerInteraction() {
		this.cgaa.interactionModus = new InteractionModus(
			new Cooperation(this, new Quests(this), this.cgaa.rerouter, this.cgaa.rivalries),
			this.cgaa.interactionCol
		);

		this.cgaa.inputs = new Inputs(this);

		this.cgaa.modi = new Modi(
			this.cgaa.inputs,
			new BuildModus([this.cgaa.shooterSpawner, this.cgaa.healerSpawner]),
			this.cgaa.interactionModus,
			this.cgaa.selectorRect
		);
	}

	private initMouse() {
		new Mouse(this, this.cgaa.player, this.cgaa.selectorRect, this.cgaa.modi);
	}

	private startWaves() {
		new WaveController(this, new CampsState(this.cgaa.campsObj.getBuildings()));
	}

	create() {
		this.initCGAA();

		this.initPhysics();

		this.initEnvironment();

		this.initEnemies();

		this.initPlayerUnitAndColleagues();

		this.initKeyboard();

		this.initShooters();

		this.initPlayerInteraction();

		this.initMouse();

		this.startWaves();
	}

	update() {
		this.cgaa.movement.update();
	}
}
