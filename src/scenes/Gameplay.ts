import { createAnims } from "../graphics/animation/animation";
import { generateTextures } from "../graphics/texture/texture";
import { Movement } from "../game/player/input/move/Movement";
import { Player } from "../game/player/unit/Player";
import { InteractionModus } from "../game/player/modi/interaction/InteractionModus";
import { SelectorRect } from "../game/player/modi/SelectorRect";
import { Modi } from "../game/player/modi/Modi";
import { Areas } from "../game/env/area/Areas";
import { StaticConfig } from "../game/base/types";
import { Collision, PhysicGroups } from "../game/collision/Collision";
import { campColors } from "../game/base/globals/globalColors";
import { WASD } from "../game/player/input/move/WASD";
import { WaveController } from "../game/enemies/wave/WaveController";
import { Mouse } from "../game/player/input/move/Mouse";
import { Enemies } from "../game/enemies/unit/Enemies";
import { Camps, CampConfig } from "../game/enemies/camp/Camps";
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
import { TowerSpawnObj } from "../game/base/spawnObj/TowerSpawnObj";
import { Spawner } from "../game/base/pool/Spawner";
import { HealerPool } from "../game/player/unit/healer/HealerPool";
import { Inputs } from "../game/player/input/Inputs";
import { BossCamp } from "../game/enemies/boss/BossCamp";
import { PlayerFriends } from "../game/player/unit/PlayerFriends";
import { GameMap } from "../game/env/GameMap";
import { CircleFactory } from "../game/enemies/unit/CircleFactory";
import { EnemySpawnObj } from "../game/base/spawnObj/EnemySpawnObj";
import { areaSize } from "../game/base/globals/globalConfig";
import { gridPartHalfSize } from "../game/base/globals/globalSizes";

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
		//TODO: this is just so that collision works
		this.cgaa.camps["boss"] = { dontAttackList: [] };
		this.cgaa.camps["blue"] = { dontAttackList: [] };
	}

	private initPhysics() {
		//TODO: return CirclePhysics
		this.cgaa.physicsGroups = new Collision(this).physicGroups;
	}

	private initEnvironment() {
		let areaStaticConfig: StaticConfig = { scene: this, physicsGroup: this.cgaa.physicsGroups.areas };
		//TODO: use other configs
		this.cgaa.areas = new Areas(areaStaticConfig);
		this.cgaa.gameMap = this.cgaa.areas.createGameMap();

		let sizeOfXAxis = 2 + 5 * areaSize;
		let sizeOfYAxis = 2 + 3 * areaSize;
		let width = sizeOfXAxis * 2 * gridPartHalfSize;
		let height = sizeOfYAxis * 2 * gridPartHalfSize;
		this.physics.world.setBounds(0, 0, width - 4 * gridPartHalfSize, height - 4 * gridPartHalfSize);
		//TODO find out why this middlePos is so wrong (clarify math)
		this.cgaa.middlePos = {
			column: Math.floor((sizeOfXAxis - 16) / 2),
			row: Math.floor((sizeOfYAxis - 4) / 2)
		};
	}

	private initFactories() {
		this.cgaa.enemies = new Enemies();

		this.cgaa.factories = campColors.reduce((prev, cur) => {
			prev[cur] = new CircleFactory(
				this,
				cur,
				{
					physicsGroup: (this.cgaa.physicsGroups as PhysicGroups).enemies[cur],
					weaponGroup: (this.cgaa.physicsGroups as PhysicGroups).enemyWeapons[cur]
				},
				this.cgaa.enemies
			);
			return prev;
		}, {});
		this.cgaa.factories["boss"] = new CircleFactory(
			this,
			"boss",
			{
				physicsGroup: (this.cgaa.physicsGroups as PhysicGroups).enemies["boss"],
				weaponGroup: (this.cgaa.physicsGroups as PhysicGroups).enemyWeapons["boss"]
			},
			this.cgaa.enemies
		);
		this.cgaa.factories["blue"] = new CircleFactory(
			this,
			"blue",
			{
				physicsGroup: (this.cgaa.physicsGroups as PhysicGroups).player,
				weaponGroup: (this.cgaa.physicsGroups as PhysicGroups).playerWeapon
			},
			this.cgaa.enemies
		);
	}

	private initEnemies() {
		this.cgaa.rivalries = new Rivalries();
		this.cgaa.rerouter = new Rerouter(this.events, this.cgaa.rivalries);
		this.cgaa.paths = new Paths(this.cgaa.rerouter);

		this.cgaa.campsObj = new Camps(
			this,
			this.cgaa.areas.areas,
			this.cgaa.physicsGroups,
			this.cgaa.enemies,
			this.cgaa.paths,
			this.cgaa.membership,
			this.cgaa.factories,
			this.cgaa.gameMap
		);

		//TODO: path to player and boss areas, mark boss paths
		new PathFactory(
			this.cgaa.gameMap.map,
			new EasyStar.js(),
			this.cgaa.paths,
			new Exits(this.cgaa.areas.areas),
			this.cgaa.middlePos
		).generatePaths(this.cgaa.campsObj.getBuildingInfos(), this.cgaa.areas.playerArea, this.cgaa.areas.bossArea);
	}

	private initBoss() {
		//TODO: fix conifg -> does not need staticConfig just scene
		//TODO: either physicGroups or physicsGroups
		//TODO: deactive units as long as not all Camps are destroyed / occupied
		//TODO: if Camps are all occupied, destroy their guard units to free up physics computation
		let bossCampConfig: CampConfig = {
			//TODO: this is not a color
			color: "boss",
			area: this.cgaa.areas.bossArea,
			//Boss camp has no buildings, just static barriers
			staticConfig: { scene: this, physicsGroup: null }
		};

		//TODO: boss path usage -> player camp
		new BossCamp(
			bossCampConfig,
			this.cgaa.enemies,
			this.cgaa.factories["boss"],
			new EnemySpawnObj((this.cgaa.gameMap as GameMap).toAreaSpawnableDict(this.cgaa.areas.bossArea), this.cgaa.enemies)
		);
	}

	private initPlayerUnitAndColleagues() {
		this.cgaa.player = Player.withChainWeapon(
			this,
			this.cgaa.physicsGroups.player,
			this.cgaa.physicsGroups.playerWeapon
		);

		new PlayerFriends(
			this,
			this.cgaa.physicsGroups.player,
			this.cgaa.physicsGroups.playerWeapon,
			this.cgaa.enemies,
			this.cgaa.areas.playerArea.getMiddlePoint()
		);

		this.cameras.main.startFollow(this.cgaa.player);
	}

	private initKeyboard() {
		this.cgaa.movement = new Movement(new WASD(this), this.cgaa.player);
	}

	private initTowers() {
		this.cgaa.selectorRect = new SelectorRect(this, 0, 0);

		const shooterPool = new ShooterPool(
			this,
			15,
			this.cgaa.physicsGroups.shooter,
			this.cgaa.physicsGroups.shooterBulletGroup
		);
		shooterPool.init();

		let towerSpawnObj = new TowerSpawnObj(this.cgaa.gameMap.toSpawnableDict(), this.cgaa.enemies);

		this.cgaa.shooterSpawner = Spawner.createShooterSpawner(this, shooterPool, towerSpawnObj);

		this.cgaa.healerSpawner = Spawner.createHealerSpawner(
			this,
			new HealerPool(this, 15, this.cgaa.physicsGroups.shooter, this.cgaa.physicsGroups.healer),
			towerSpawnObj
		);
		//TODO: init healerpool?
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

	startWaves() {
		new WaveController(this, this.cgaa.campsObj);
	}

	create() {
		this.initCGAA();

		this.initPhysics();

		this.initEnvironment();

		this.initFactories();

		this.initEnemies();

		this.initBoss();

		this.initPlayerUnitAndColleagues();

		this.initKeyboard();

		this.initTowers();

		this.initPlayerInteraction();

		this.initMouse();
	}

	update() {
		this.cgaa.movement.update();
	}
}
