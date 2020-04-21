import { generateTextures } from "../graphics/texture/texture";
import { createAnims } from "../graphics/animation/animation";
import { Paths } from "../game/path/Paths";
import { Orientation } from "../game/path/Orientation";
import { Areas } from "../game/env/area/Areas";
import { Collision } from "../game/physic/Collision";
import { CampOrder } from "../game/camp/CampOrder";
import { Camps } from "../game/camp/Camps";
import { GameMap } from "../game/env/GameMap";
import { CampExits } from "../game/camp/CampExits";
import { PathFactory } from "../game/path/PathFactory";
import { PathCalculator } from "../game/path/PathCalculator";
import { PathConfig } from "../game/path/PathConfig";
import { Enemies } from "../game/unit/Enemies";
import { UnitSetup } from "../game/setup/UnitSetup";
import { CircleFactory } from "../game/unit/CircleFactory";
import { Player } from "../game/unit/Player";
import { Movement } from "../game/input/Movement";
import { WASD } from "../game/input/WASD";
import { MouseMovement } from "../game/input/MouseMovement";
import { SelectorRect } from "../game/modi/SelectorRect";
import { Spawner } from "../game/pool/Spawner";
import { TowerSpawnObj } from "../game/spawn/TowerSpawnObj";
import { TowerSetup } from "../game/setup/TowerSetup";
import { Cooperation } from "../game/state/Cooperation";
import { Quests } from "../game/state/Quests";
import { CampRouting } from "../game/camp/CampRouting";
import { Rivalries } from "../game/state/Rivalries";
import { UnitCollection } from "../game/base/UnitCollection";
import { BuildingFactory } from "../game/building/BuildingFactory";
import { BossCamp } from "../game/camp/BossCamp";
import { BossSetup } from "../game/setup/BossSetup";
import { CampSetup } from "../game/setup/CampSetup";
import { WavePopulator } from "../game/populator/WavePopulator";
import { EnemySpawnObj } from "../game/spawn/EnemySpawnObj";
import { PathAssigner } from "../game/path/PathAssigner";
import { CampsState } from "../game/state/CampsState";
import { WaveController } from "../game/wave/WaveController";
import { WaveOrder } from "../game/wave/WaveOrder";
import { Building } from "../game/building/Building";
import { TowerModus } from "../game/modi/TowerModus";
import { DangerousCirclePool, BossPool } from "../game/pool/CirclePool";
import { BarrierFactory } from "../game/camp/BarrierFactory";
import { PlayerFriends } from "../game/unit/PlayerFriends";
import { BuildManager } from "../game/ui/select/BuildManager";
import { weaponTextures } from "../game/weapon/chain/texture";
import { GuardComponent } from "../game/ai/GuardComponent";

export class Gameplay extends Phaser.Scene {
	cgaa: any = {};

	constructor() {
		super("Gameplay");
	}

	preload() {
		generateTextures(this);
		weaponTextures(this);

		createAnims(this.anims);

		this.gameState();
		this.gamePhysics();
		this.gameEnv();
		this.gameCamps();
		this.gamePlayerState();
		this.gameOrientation();
		this.gameBoss();
		this.gamePathfinding();
		this.gameWaves();
		this.gamePlayer();
	}

	gameState() {
		//Setup minimal Game State for collision handling
		this.cgaa.rivalries = new Rivalries();
		this.cgaa.router = new CampRouting(this.events, this.cgaa.rivalries);
		this.cgaa.cooperation = new Cooperation(this, this.cgaa.router, this.cgaa.rivalries);
	}

	gamePhysics() {
		//Setup Physics and Sight
		this.cgaa.collision = new Collision(this, this.cgaa.cooperation);
	}

	gameEnv() {
		//Setup Environment
		this.cgaa.areas = new Areas(this, this.cgaa.collision.physicsGroups.areas);
		this.cgaa.gameMap = new GameMap(this.cgaa.areas);
	}

	gameCamps() {
		this.cgaa.enemies = new Enemies();
		this.cgaa.order = new CampOrder();
		this.cgaa.camps = new Camps(this.cgaa.order, this.cgaa.areas, this.cgaa.gameMap);
		this.cgaa.gameMap.updateWith(this.cgaa.camps);
		this.cgaa.camps.ordinary.forEach((camp) => {
			camp.createBuildings(new BuildingFactory(this, this.cgaa.collision.physicsGroups.buildings[camp.id]), [
				...UnitSetup.circleSizeNames,
			]);
		});
		this.cgaa.campsState = new CampsState(
			this,
			this.cgaa.camps.ordinary.map((camp) => camp.buildings)
		);
		this.cgaa.camps.ordinary.forEach((camp) => {
			let factory = new CircleFactory(
				this,
				camp.id,
				this.cgaa.collision.physicsGroups.pairs[camp.id],
				this.cgaa.enemies,
				this.cgaa.collision.physicsGroups.pairs[camp.id].weaponGroup
			);
			//TODO: populate camp with more than big units
			camp.populate(
				this,
				new DangerousCirclePool(this, UnitSetup.campSize, factory, this.cgaa.enemies, "Big"),
				this.cgaa.enemies,
				this.cgaa.campsState
			);
			camp.createInteractionCircle(factory);
		});
	}

	gamePlayerState() {
		let essentialDict = this.cgaa.camps.ordinary.reduce((prev, cur) => {
			prev[cur.id] = (cur.buildings as any[]).concat(cur.interactionUnit);
			return prev;
		}, {});

		let quests = new Quests(this, this.cgaa.rivalries, essentialDict);
		this.cgaa.cooperation.setQuests(quests);
	}

	gameOrientation() {
		//Setup Orientation
		this.cgaa.orientation = new Orientation(
			this.cgaa.gameMap.getMiddle(),
			this.cgaa.camps.player.area.getMiddle(),
			this.cgaa.camps.boss.area.getMiddle(),
			this.cgaa.camps
		);
	}

	gameBoss() {
		let bossFactory = new CircleFactory(
			this,
			CampSetup.bossCampID,
			this.cgaa.collision.physicsGroups.pairs[CampSetup.bossCampID],
			this.cgaa.enemies,
			this.cgaa.collision.physicsGroups.pairs[CampSetup.bossCampID].weaponGroup
		);
		let bossCamp = new BossCamp(this.cgaa.camps.boss.area, this.cgaa.gameMap);
		bossCamp.populate(
			this,
			new BossPool(this, BossSetup.bossGroupSize, bossFactory, this.cgaa.enemies),
			this.cgaa.enemies,
			this.cgaa.campsState
		);
		let king = bossFactory.createKing();
		king.stateHandler.setComponents([new GuardComponent(king, king.stateHandler)]);

		let point = this.cgaa.orientation.middleOfBossArea.toPoint();
		king.setPosition(point.x, point.y);

		let bossExitPositions = bossCamp.area.exit.relativePositions.map((relPos) => relPos.toPoint());
		new BarrierFactory(this, this.cgaa.collision.physicsGroups.areas).produce(bossExitPositions);
	}

	gamePathfinding() {
		this.cgaa.exits = new CampExits(this.cgaa.areas.exits, this.cgaa.order);
		let configs = PathConfig.createConfigs(this.cgaa.orientation, this.cgaa.exits, this.cgaa.camps.arr);
		let paths = new Paths(
			this.cgaa.orientation,
			PathFactory.produce(new PathCalculator(this.cgaa.gameMap.map), configs)
		);
		this.cgaa.assigner = new PathAssigner(paths, this.cgaa.router);
	}

	gameWaves() {
		//Setup Waves
		this.cgaa.waveOrder = new WaveOrder(this.cgaa.campsState);
		CampSetup.ordinaryCampIDs.forEach((campID) => {
			this.cgaa.camps
				.get(campID)
				.createBuildingSpawnableDictsPerBuilding()
				.forEach((pair) => {
					new WavePopulator(
						this,
						campID,
						new DangerousCirclePool(
							this,
							8,
							new CircleFactory(
								this,
								campID,
								this.cgaa.collision.physicsGroups.pairs[campID],
								this.cgaa.enemies,
								this.cgaa.collision.physicsGroups.pairs[campID].weaponGroup
							),
							this.cgaa.enemies,
							(pair[0] as Building).spawnUnit
						),
						new EnemySpawnObj(pair[1], this.cgaa.enemies),
						this.cgaa.assigner,
						this.cgaa.campsState,
						(pair[0] as Building).id
					);
				});
		});
	}

	gamePlayer() {
		//Setup Player
		let playerExit = this.cgaa.exits.getExitFor(CampSetup.playerCampID).toPoint();
		let player = Player.withChainWeapon(
			this,
			this.cgaa.collision.physicsGroups.player,
			this.cgaa.collision.physicsGroups.playerWeapon,
			playerExit.x,
			playerExit.y
		);
		this.cgaa.player = player;
		this.cameras.main.startFollow(player);
		this.cgaa.movement = new Movement(new WASD(this), player);
		this.cgaa.friends = new PlayerFriends(
			this.cgaa.orientation.middleOfPlayerArea.toPoint(),
			new CircleFactory(
				this,
				CampSetup.playerCampID,
				{
					physicsGroup: this.cgaa.collision.physicsGroups.player,
					weaponGroup: this.cgaa.collision.physicsGroups.playerWeapon,
				},
				this.cgaa.enemies,
				{ Big: this.cgaa.collision.physicsGroups.playerFriendsWeapons, Small: null, Normal: null }
			)
		).friends;

		//Setup MouseMovement Modes
		//TODO: shooter pool should respect healer placments
		this.cgaa.shooterPool = this.cgaa.collision.physicsGroups.shooters;
		this.cgaa.healerPool = this.cgaa.collision.physicsGroups.healers;
		let towerSpawnObj = new TowerSpawnObj(this.cgaa.gameMap.getSpawnableDict(), this.cgaa.enemies);

		//Depending on start-money can spawn or not
		let healerSpawner = Spawner.createHealerSpawner(this, this.cgaa.collision.physicsGroups.healers, towerSpawnObj);
		let shooterSpawner = Spawner.createShooterSpawner(this, this.cgaa.collision.physicsGroups.shooters, towerSpawnObj);
		shooterSpawner.canSpawn = true;

		this.cgaa.interactionCollection = new UnitCollection(
			this.cgaa.camps.ordinary.map((camp) => {
				return camp.interactionUnit;
			})
		);

		this.cgaa.selectorRect = new SelectorRect(this, 0, 0);
		let healerMode = new TowerModus(healerSpawner, this.cgaa.selectorRect, TowerSetup.maxHealers);
		let shooterMode = new TowerModus(shooterSpawner, this.cgaa.selectorRect, TowerSetup.maxShooters);
		this.cgaa.build = new BuildManager(this, healerMode, shooterMode);

		new MouseMovement(this, player, this.cgaa.selectorRect);
	}

	startWaves() {
		new WaveController(this, this.cgaa.waveOrder);
	}

	update() {
		this.cgaa.movement.update();
	}
}
