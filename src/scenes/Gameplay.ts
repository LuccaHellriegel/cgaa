import { generateTextures } from "../graphics/texture/texture";
import { createAnims } from "../graphics/animation/animation";
import { Paths } from "../game/path/Paths";
import { Orientation } from "../game/path/Orientation";
import { Areas } from "../game/env/area/Areas";
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
import { CampRouting } from "../game/camp/CampRouting";
import { UnitCollection } from "../game/base/UnitCollection";
import { BuildingFactory } from "../game/building/BuildingFactory";
import { BossCamp } from "../game/camp/BossCamp";
import { BossSetup } from "../game/setup/BossSetup";
import { CampSetup } from "../game/setup/CampSetup";
import { WavePopulator } from "../game/populator/WavePopulator";
import { EnemySpawnObj } from "../game/spawn/EnemySpawnObj";
import { PathAssigner } from "../game/path/PathAssigner";
import { CampsState } from "../game/camp/CampsState";
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
import { initCollision } from "../game/physics/physics";
import { DangerousCircle } from "../game/unit/DangerousCircle";
import { Shooters } from "../game/tower/shooter/Shooter";
import { Healers } from "../game/tower/healer/Healer";
import { initPools } from "../game/pool/pools";
import { initStartState } from "../game/state/state";
import { Quests } from "../game/state/Quests";
import { InteractionCircle } from "../game/unit/InteractionCircle";

export class Gameplay extends Phaser.Scene {
	cgaa: {
		collision: {
			addEnv: Function;

			addBuilding: Function;

			addUnit: Function;

			addTower: Function;

			addBullet: Function;
		};
		areas: Areas;
		gameMap: GameMap;
		enemies: Enemies;
		order: CampOrder;
		camps: Camps;
		campsState: CampsState;
		orientation: Orientation;
		exits: CampExits;
		assigner: PathAssigner;
		waveOrder: WaveOrder;
		player: Player;
		movement: Movement;
		friends: DangerousCircle[];
		shooterPool: Shooters;
		healerPool: Healers;
		interactionCollection: UnitCollection;
		selectorRect: SelectorRect;
		build: BuildManager;
		pools: {
			healers;
			shooters;
			bullets;
			weapons;
			friendWeapons;
			bossWeapons;
		};
		interaction: Function;
	} = {};

	cgaaState;

	constructor() {
		super("Gameplay");
	}

	preload() {
		generateTextures(this);
		weaponTextures(this);

		createAnims(this.anims);

		this.cgaaState = initStartState(this);
		//Setup Physics and Sight
		this.cgaa.collision = initCollision(this, this.cgaaState.cooperation);

		this.gameEnv();
		this.gamePlayer();
		this.gameCamps();
		this.gameInitQuests();
		this.gameOrientation();
		this.gameBoss();
		this.gamePathfinding();
		this.gameWaves();
		this.gamePlayerCamp();
		this.gamePlayerInput();

		this.cgaa.interaction = function interactWithCircle(interactCircle: InteractionCircle) {
			let id = interactCircle.campID;
			//Can not accept quests from rivals
			if (!this.cgaaState.quests.get(this.cgaaState.rivalries.getRival(id)).isActiveOrSuccess()) {
				if (!interactCircle.quest.isActiveOrSuccess()) interactCircle.quest.setActive();
				if (interactCircle.quest.isSuccess()) {
					// check if id has cooperation with player, because id would need to be rerouted
					if (this.cgaaState.cooperation.hasCooperation(id, CampSetup.playerCampID)) {
						this.cgaaState.router.reroute(id);
					} else {
						this.cgaaState.cooperation.activateCooperation(id);
					}
				}
			}
		}.bind(this);

		// this.cgaa.interaction = new Interaction(
		// 	this.cgaaState.router,
		// 	this.cgaaState.rivalries,
		// 	this.cgaaState.quests,
		// 	this.cgaaState.cooperation
		// );
	}

	gameEnv() {
		//Setup Environment
		this.cgaa.areas = new Areas(this, this.cgaa.collision.addEnv);
		this.cgaa.gameMap = new GameMap(this.cgaa.areas);

		this.cgaa.order = new CampOrder();
		this.cgaa.exits = new CampExits(this.cgaa.areas.exits, this.cgaa.order);
	}

	gamePlayer() {
		//Setup Player
		let playerExit = this.cgaa.exits.getExitFor(CampSetup.playerCampID).toPoint();
		let player = Player.withChainWeapon(this, playerExit.x, playerExit.y);
		this.cgaa.collision.addUnit(player);
		this.cgaa.player = player;

		// this needs player, so it happens here...
		// not happy with the coupling
		this.cgaa.pools = initPools(this, this.cgaa.collision.addTower, this.cgaa.collision.addBullet, this.cgaa.player);
	}

	gamePlayerCamp() {
		this.cameras.main.startFollow(this.cgaa.player);
		this.cgaa.movement = new Movement(new WASD(this), this.cgaa.player);

		let playerCampMiddlePoint = this.cgaa.orientation.middleOfPlayerArea.toPoint();
		let friendPools = {
			Big: this.cgaa.pools.friendWeapons,
			Small: null,
			Normal: null,
		};
		let friendFactory = new CircleFactory(
			this,
			CampSetup.playerCampID,
			this.cgaa.collision.addUnit,
			this.cgaa.enemies,
			friendPools
		);
		this.cgaa.friends = new PlayerFriends(playerCampMiddlePoint, friendFactory).friends;

		//TODO: shooter pool should respect healer placements
		this.cgaa.shooterPool = this.cgaa.pools.shooters;
		this.cgaa.healerPool = this.cgaa.pools.healers;
	}

	gamePlayerInput() {
		//Setup MouseMovement Modes

		let towerSpawnObj = new TowerSpawnObj(this.cgaa.gameMap.getSpawnableDict(), this.cgaa.enemies);

		//Depending on start-money can spawn or not
		let healerSpawner = Spawner.createHealerSpawner(this, this.cgaa.pools.healers, towerSpawnObj);
		let shooterSpawner = Spawner.createShooterSpawner(this, this.cgaa.pools.shooters, towerSpawnObj);
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

		new MouseMovement(this, this.cgaa.player, this.cgaa.selectorRect);
	}

	gameCamps() {
		this.cgaa.enemies = new Enemies();
		this.cgaa.camps = new Camps(this.cgaa.order, this.cgaa.areas, this.cgaa.gameMap);
		this.cgaa.gameMap.updateWith(this.cgaa.camps);
		this.cgaa.camps.ordinary.forEach((camp) => {
			camp.createBuildings(new BuildingFactory(this, this.cgaa.collision.addBuilding), [...UnitSetup.circleSizeNames]);
		});
		this.cgaa.campsState = new CampsState(
			this,
			this.cgaa.camps.ordinary.map((camp) => camp.buildings)
		);
		this.cgaa.camps.ordinary.forEach((camp) => {
			let factory = new CircleFactory(
				this,
				camp.id,
				this.cgaa.collision.addUnit,
				this.cgaa.enemies,
				this.cgaa.pools.weapons[camp.id]
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

	gameInitQuests() {
		this.cgaaState.quests.createStartQuests(this, this.cgaaState.rivalries);

		this.cgaa.camps.ordinary.forEach((camp) => {
			camp.interactionUnit.setQuest(this.cgaaState.quests.get(camp.id));
		});
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
		let bossFactory = new CircleFactory(this, CampSetup.bossCampID, this.cgaa.collision.addUnit, this.cgaa.enemies, {
			Big: this.cgaa.pools.bossWeapons,
			Small: null,
			Normal: null,
		});
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
		new BarrierFactory(this, this.cgaa.collision.addEnv).produce(bossExitPositions);
	}

	gamePathfinding() {
		let configs = PathConfig.createConfigs(this.cgaa.orientation, this.cgaa.exits, this.cgaa.camps.arr);
		let paths = new Paths(
			this.cgaa.orientation,
			PathFactory.produce(new PathCalculator(this.cgaa.gameMap.map), configs)
		);
		this.cgaa.assigner = new PathAssigner(paths, this.cgaaState.router);
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
								this.cgaa.collision.addUnit,
								this.cgaa.enemies,
								this.cgaa.pools.weapons[campID]
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

	startWaves() {
		new WaveController(this, this.cgaa.waveOrder);
	}

	update() {
		this.cgaa.movement.update();
	}
}
