import { createAnims } from "../graphics/animation/animation";
import { generateTextures } from "../graphics/texture/texture";
import { Movement } from "../game/player/input/move/Movement";
import { Player } from "../game/player/unit/Player";
import { InteractionModus } from "../game/player/modi/interaction/InteractionModus";
import { SelectorRect } from "../game/player/modi/SelectorRect";
import { Modi } from "../game/player/modi/Modi";
import { createAreas, constructAreaConfigs, removeNonEnemyAreas } from "../game/area/area";
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
import { TowerSpawnObj } from "../game/base/spawn/TowerSpawnObj";
import { Spawner } from "../game/base/pool/Spawner";
import { HealerPool } from "../game/player/unit/healer/HealerPool";
import { Inputs } from "../game/player/input/Inputs";
import { BossCamp } from "../game/enemies/boss/BossCamp";
import { PlayerFriends } from "../game/player/unit/PlayerFriends";
import { areaToRealMiddlePoint } from "../game/base/position";
import { GameMap } from "../game/base/GameMap";
import { CircleFactory } from "../game/enemies/unit/CircleFactory";

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
		let [areaConfigs, playerAreaConfig, bossAreaConfig] = constructAreaConfigs(areaStaticConfig);
		this.cgaa.areaConfigs = areaConfigs;
		this.cgaa.playerAreaConfig = playerAreaConfig;
		this.cgaa.bossAreaConfig = bossAreaConfig;

		let { unifiedMap, middlePos } = createAreas(this.cgaa.areaConfigs);
		this.cgaa.unifiedMap = unifiedMap;
		this.cgaa.middlePos = middlePos;

		this.cgaa.areaConfigs = removeNonEnemyAreas(areaConfigs, playerAreaConfig, bossAreaConfig);
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
			this.cgaa.unifiedMap,
			this.cgaa.areaConfigs,
			this.cgaa.physicsGroups,
			this.cgaa.enemies,
			this.cgaa.paths,
			this.cgaa.membership,
			this.cgaa.factories
		);

		//TODO: path to player and boss areas, mark boss paths
		new PathFactory(
			this.cgaa.unifiedMap,
			new EasyStar.js(),
			this.cgaa.paths,
			new Exits(this.cgaa.areaConfigs),
			this.cgaa.middlePos
		).generatePaths(this.cgaa.campsObj.getBuildingInfos(), this.cgaa.playerAreaConfig, this.cgaa.bossAreaConfig);
	}

	private initBoss() {
		//TODO: fix conifg -> does not need staticConfig just scene
		//TODO: either physicGroups or physicsGroups
		//TODO: deactive units as long as not all Camps are destroyed / occupied
		//TODO: if Camps are all occupied, destroy their guard units to free up physics computation
		let bossCampConfig: CampConfig = {
			//TODO: this is not a color
			color: "boss",
			map: this.cgaa.unifiedMap,
			areaConfig: this.cgaa.bossAreaConfig,
			staticConfig: { scene: this, physicsGroup: null },
			//TODO: physicGroups for boss
			enemyPhysicGroup: this.cgaa.physicsGroups.enemies["boss"],
			weaponPhysicGroup: this.cgaa.physicsGroups.enemyWeapons["boss"]
		};

		//TODO: boss path usage -> player camp
		new BossCamp(bossCampConfig, this.cgaa.enemies, this.cgaa.factories["boss"]);
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
			areaToRealMiddlePoint(this.cgaa.playerAreaConfig)
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

		let gameMap = new GameMap(this.cgaa.unifiedMap);
		let towerSpawnObj = new TowerSpawnObj(gameMap.toSpawnableDict(), this.cgaa.enemies);

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

	private startWaves() {
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

		this.startWaves();
	}

	update() {
		this.cgaa.movement.update();
	}
}
