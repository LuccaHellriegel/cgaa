import { generateTextures } from "../graphics/texture/texture";
import { createAnims } from "../graphics/animation/animation";
import { Paths } from "../game/path/Paths";
import { Orientation } from "../game/path/Orientation";
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
import { SelectorRect } from "../game/ui/SelectorRect";
import { Spawner } from "../game/tower/Spawner";
import { TowerSpawnObj } from "../game/spawn/TowerSpawnObj";
import { TowerSetup } from "../game/setup/TowerSetup";
import { BuildingFactory } from "../game/building/BuildingFactory";
import { BossCamp } from "../game/camp/boss/BossCamp";
import { BossSetup } from "../game/setup/BossSetup";
import { CampSetup } from "../game/setup/CampSetup";
import { WavePopulator } from "../game/populator/WavePopulator";
import { EnemySpawnObj } from "../game/spawn/EnemySpawnObj";
import { PathAssigner } from "../game/path/PathAssigner";
import { CampsState } from "../game/camp/CampsState";
import { WaveController } from "../game/wave/WaveController";
import { WaveOrder } from "../game/wave/WaveOrder";
import { Building } from "../game/building/Building";
import { TowerModus } from "../game/tower/TowerModus";
import { DangerousCirclePool, BossPool } from "../game/pool/CirclePool";
import { BarrierFactory } from "../game/camp/boss/BarrierFactory";
import { PlayerFriends } from "../game/unit/PlayerFriends";
import { BuildManager } from "../game/ui/build/BuildManager";
import { initCollision } from "../game/physics/physics";
import { DangerousCircle } from "../game/unit/DangerousCircle";
import { Shooters } from "../game/tower/Shooter";
import { Healers } from "../game/tower/Healer";
import { initPools } from "../game/pool/pools";
import { InteractionCircle } from "../game/unit/InteractionCircle";
import { Quest } from "../engine/quest/Quest";
import { EventSetup } from "../game/setup/EventSetup";
import { CGAAData } from "../game/state/CGAAData";
import { ClickModes } from "../engine/ui/modes/ClickModes";
import { WallFactory } from "../game/env/wall/WallFactory";
import { Areas, CommonWaypoint, Layout } from "../game/env/environment";
import { weaponTextures } from "../game/weapon/chain-weapon";

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
		spawners: Spawner[];
		commonWaypoint: CommonWaypoint;
	} = {};

	cgaaData: CGAAData;

	constructor() {
		super("Gameplay");
	}

	preload() {
		generateTextures(this);
		weaponTextures(this);

		createAnims(this.anims);
		this.cgaaData = new CGAAData(this);
		this.cgaa.collision = initCollision(this, this.cgaaData.cooperation);
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
			if (!this.cgaaData.quests.get(this.cgaaData.rivalries.getRival(id)).isActiveOrSuccess()) {
				if (!interactCircle.quest.isActiveOrSuccess()) interactCircle.quest.setActive();
				if (interactCircle.quest.isSuccess()) {
					// check if id has cooperation with player, because id would need to be rerouted
					if (this.cgaaData.cooperation.hasCooperation(id, CampSetup.playerCampID)) {
						this.cgaaData.router.reroute(id);
					} else {
						this.cgaaData.cooperation.activateCooperation(id, CampSetup.playerCampID);
					}
				}
			}
		}.bind(this);
	}

	gameEnv() {
		//Setup Environment
		const layout = Layout.layout1();
		this.cgaa.commonWaypoint = new CommonWaypoint(layout, "middle");
		this.cgaa.areas = new Areas(new WallFactory(this, this.cgaa.collision.addEnv), layout);
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
		this.cgaa.spawners = [healerSpawner, shooterSpawner];
		shooterSpawner.canSpawn = true;

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
		CampSetup.ordinaryCampIDs.forEach((id) => {
			let rivalID = this.cgaaData.rivalries.getRival(id);
			let amountToKill = CampSetup.numbOfDiplomats + CampSetup.numbOfBuildings;
			let quest = Quest.killQuest(
				this,
				this.cgaaData.rivalries,
				this.cgaaData.quests,
				id,
				this.events,
				EventSetup.unitKilledEvent,
				rivalID,
				amountToKill,
				EventSetup.essentialUnitsKilled,
				rivalID
			);
			this.cgaaData.quests.set(id, quest);
		});

		this.cgaa.camps.ordinary.forEach((camp) => {
			camp.interactionUnit.setQuest(this.cgaaData.quests.get(camp.id));
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
		this.cgaa.orientation.setCommonWaypoint(this.cgaa.commonWaypoint);
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
		bossCamp.positionKing(bossFactory, this.cgaa.orientation.middleOfBossArea.toPoint());
		bossCamp.placeBarriers(new BarrierFactory(this, this.cgaa.collision.addEnv));
	}

	gamePathfinding() {
		const configs = PathConfig.createConfigs(
			this.cgaa.orientation,
			this.cgaa.orientation.commonWaypoint,
			this.cgaa.exits,
			this.cgaa.camps.arr
		);
		const paths = new Paths(
			this.cgaa.orientation,
			PathFactory.produce(new PathCalculator(this.cgaa.gameMap.map), configs)
		);
		this.cgaa.assigner = new PathAssigner(paths, this.cgaaData.router);
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

	setModes(modes: ClickModes) {
		this.cgaa.camps.ordinary.forEach((camp) => {
			modes.addTo(camp.interactionUnit);
		});
		this.cgaa.spawners.forEach((spawner) => {
			spawner.setModes(modes);
		});
	}

	startWaves() {
		new WaveController(this, this.cgaa.waveOrder);
	}

	update() {
		this.cgaa.movement.update();
	}

	create() {}
}
