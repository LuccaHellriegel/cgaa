import { createAnims } from "../graphics/animation/animation";
import { generateTextures } from "../graphics/texture/texture";
import { Movement } from "../game/player/input/move/Movement";
import { TowerManager } from "../game/player/towers/TowerManager";
import { Player } from "../game/player/unit/Player";
import { InteractionModus } from "../game/player/input/modi/interaction/InteractionModus";
import { Square } from "../game/player/unit/Square";
import { GhostTower } from "../game/player/input/modi/interaction/GhostTower";
import { Modi } from "../game/player/input/modi/Modi";
import { relativePositionToPoint } from "../game/base/position";
import { createAreas, constructAreaConfigs } from "../game/area/area";
import { StaticConfig } from "../game/base/types";
import { createTowerSpawnObj } from "../game/base/spawn/spawn";
import { calculatePaths } from "../game/enemies/path/path";
import { enableCollision } from "../game/collision/collision";
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

export class Gameplay extends Phaser.Scene {
	movement: Movement;
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
			interactionElements: [],
			enemies: new Enemies(),
			pathDict: {},
			camps: {}
		};

		campColors.forEach(color => (this.cgaa.camps[color] = { dontAttackList: [] }));
	}

	private initPhysics() {
		this.cgaa.physicsGroups = enableCollision(this);
	}

	private initEnvironment() {
		let areaStaticConfig: StaticConfig = { scene: this, physicsGroup: this.cgaa.physicsGroups.areas };
		this.cgaa.areaConfigs = constructAreaConfigs(areaStaticConfig);
		let { unifiedMap, middlePos } = createAreas(this.cgaa.areaConfigs);
		this.cgaa.unifiedMap = unifiedMap;
		this.cgaa.middlePos = middlePos;
	}

	private initEnemies() {
		this.cgaa.rivalries = new Rivalries();
		this.cgaa.rerouter = new Rerouter(this.events, this.cgaa.rivalries);

		this.cgaa.campsObj = new Camps(
			this,
			this.cgaa.unifiedMap,
			this.cgaa.areaConfigs,
			this.cgaa.physicsGroups,
			this.cgaa.enemies,
			this.cgaa.rerouter
		);

		calculatePaths({
			scene: this,
			unifiedMap: this.cgaa.unifiedMap,
			areaConfigs: this.cgaa.areaConfigs,
			middlePos: this.cgaa.middlePos,
			buildingInfos: this.cgaa.campsObj.getBuildingInfos()
		});
	}

	private initPlayerUnitAndColleagues() {
		let pos = relativePositionToPoint(this.cgaa.middlePos.column, this.cgaa.middlePos.row);
		this.cgaa.interactionElements.push(new Square(this, pos.x, pos.y, this.cgaa.physicsGroups.player));

		this.cgaa.player = Player.withChainWeapon(
			this,
			this.cgaa.physicsGroups.player,
			this.cgaa.physicsGroups.playerWeapon
		);
		this.cameras.main.startFollow(this.cgaa.player);
	}

	private initKeyboard() {
		this.cgaa.keyObjF = this.input.keyboard.addKey("F");
		this.cgaa.keyObjE = this.input.keyboard.addKey("E");
		this.cgaa.movement = new Movement(new WASD(this), this.cgaa.player);
	}

	private initTowers() {
		let towerSpawnObj = createTowerSpawnObj(this.cgaa.unifiedMap, this.cgaa.areaConfigs, this.cgaa.enemies);
		this.cgaa.towerManager = new TowerManager(
			this,
			this.cgaa.physicsGroups.towers,
			this.cgaa.physicsGroups.towerBulletGroup,
			towerSpawnObj,
			this.cgaa.ghostTower
		);
	}

	private initPlayerInteraction() {
		this.cgaa.ghostTower = new GhostTower(this, 0, 0, this.cgaa.keyObjF);

		this.cgaa.interactionModus = new InteractionModus(
			this,
			this.cgaa.ghostTower,
			this.cgaa.keyObjE,
			new Cooperation(this, new Quests(this), this.cgaa.rerouter, this.cgaa.rivalries)
		);

		this.cgaa.modi = new Modi(this.cgaa.keyObjF, this.cgaa.interactionModus, this.cgaa.towerManager);
	}

	private initMouse() {
		new Mouse(this, this.cgaa.player, this.cgaa.ghostTower, this.cgaa.modi);
	}

	private startWaves() {
		new WaveController(this, new CampsState(this.cgaa.campsObj.getCampBuildings()));
	}

	create() {
		this.initCGAA();

		this.initPhysics();

		this.initEnvironment();

		this.initEnemies();

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
