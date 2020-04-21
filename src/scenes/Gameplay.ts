import { generateTextures } from "../graphics/texture/texture";
import { createAnims } from "../graphics/animation/animation";
import { Paths } from "../game/path/Paths";
import { Orientation } from "../game/path/Orientation";
import { Areas } from "../game/env/area/Areas";
import { WallFactory } from "../game/env/wall/WallFactory";
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
	}

	create() {
		//Setup minimal Game State for collision handling
		let rivalries = new Rivalries();
		let router = new CampRouting(this.events, rivalries);
		let cooperation = new Cooperation(this, router, rivalries);

		//Setup Physics and Sight
		let collision = new Collision(this, cooperation);

		//Setup Environment
		let wallFactory = new WallFactory(this, collision.PhysicsGroups.areas);
		let areas = new Areas(wallFactory);
		let gameMap = new GameMap(areas);

		//Setup Camps
		let enemies = new Enemies();
		let order = new CampOrder();
		let camps = new Camps(order, areas, gameMap);
		gameMap.updateWith(camps);
		camps.ordinary.forEach((camp) => {
			camp.createBuildings(new BuildingFactory(this, collision.PhysicsGroups.buildings[camp.id]), [
				...UnitSetup.circleSizeNames,
			]);
		});
		let campsState = new CampsState(
			this,
			camps.ordinary.map((camp) => camp.buildings)
		);
		camps.ordinary.forEach((camp) => {
			let factory = new CircleFactory(
				this,
				camp.id,
				collision.PhysicsGroups.pairs[camp.id],
				enemies,
				collision.PhysicsGroups.pairs[camp.id].weaponGroup
			);
			//TODO: populate camp with more than big units
			camp.populate(
				this,
				new DangerousCirclePool(this, UnitSetup.campSize, factory, enemies, "Big"),
				enemies,
				campsState
			);
			camp.createInteractionCircle(factory);
		});

		//Setup GameState
		let essentialDict = camps.ordinary.reduce((prev, cur) => {
			prev[cur.id] = (cur.buildings as any[]).concat(cur.interactionUnit);
			return prev;
		}, {});

		let quests = new Quests(this, rivalries, essentialDict);
		cooperation.setQuests(quests);

		//Setup Orientation
		let orientation = new Orientation(
			gameMap.getMiddle(),
			camps.player.area.getMiddle(),
			camps.boss.area.getMiddle(),
			camps
		);

		//Setup Boss
		let bossFactory = new CircleFactory(
			this,
			CampSetup.bossCampID,
			collision.PhysicsGroups.pairs[CampSetup.bossCampID],
			enemies,
			collision.PhysicsGroups.pairs[CampSetup.bossCampID].weaponGroup
		);
		let bossCamp = new BossCamp(camps.boss.area, gameMap);
		bossCamp.populate(this, new BossPool(this, BossSetup.bossGroupSize, bossFactory, enemies), enemies, campsState);
		let king = bossFactory.createKing();
		king.stateHandler.setComponents([new GuardComponent(king, king.stateHandler)]);

		let point = orientation.middleOfBossArea.toPoint();
		king.setPosition(point.x, point.y);

		let bossExitPositions = bossCamp.area.exit.relativePositions.map((relPos) => relPos.toPoint());
		new BarrierFactory(this, collision.PhysicsGroups.areas).produce(bossExitPositions);

		//Setup Pathfinding
		let exits = new CampExits(areas.exits, order);
		let configs = PathConfig.createConfigs(orientation, exits, camps.arr);
		let paths = new Paths(orientation, PathFactory.produce(new PathCalculator(gameMap.map), configs));
		let assigner = new PathAssigner(paths, router);

		//Setup Waves
		this.cgaa.waveOrder = new WaveOrder(campsState);
		CampSetup.ordinaryCampIDs.forEach((campID) => {
			camps
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
								collision.PhysicsGroups.pairs[campID],
								enemies,
								collision.PhysicsGroups.pairs[campID].weaponGroup
							),
							enemies,
							(pair[0] as Building).spawnUnit
						),
						new EnemySpawnObj(pair[1], enemies),
						assigner,
						campsState,
						(pair[0] as Building).id
					);
				});
		});

		//Setup Player
		let playerExit = exits.getExitFor(CampSetup.playerCampID).toPoint();
		let player = Player.withChainWeapon(
			this,
			collision.PhysicsGroups.player,
			collision.PhysicsGroups.playerWeapon,
			playerExit.x,
			playerExit.y
		);
		this.cgaa.player = player;
		this.cameras.main.startFollow(player);
		this.cgaa.movement = new Movement(new WASD(this), player);
		this.cgaa.friends = new PlayerFriends(
			orientation.middleOfPlayerArea.toPoint(),
			new CircleFactory(
				this,
				CampSetup.playerCampID,
				{
					physicsGroup: collision.PhysicsGroups.player,
					weaponGroup: collision.PhysicsGroups.playerWeapon,
				},
				enemies,
				{ Big: collision.PhysicsGroups.playerFriendsWeapons, Small: null, Normal: null }
			)
		).friends;

		//Setup MouseMovement Modes
		//TODO: shooter pool should respect healer placments
		this.cgaa.shooterPool = collision.PhysicsGroups.shooters;
		this.cgaa.healerPool = collision.PhysicsGroups.healers;
		let towerSpawnObj = new TowerSpawnObj(gameMap.getSpawnableDict(), enemies);

		//Depending on start-money can spawn or not
		let healerSpawner = Spawner.createHealerSpawner(this, collision.PhysicsGroups.healers, towerSpawnObj);
		let shooterSpawner = Spawner.createShooterSpawner(this, collision.PhysicsGroups.shooters, towerSpawnObj);
		shooterSpawner.canSpawn = true;

		this.cgaa.interactionCollection = new UnitCollection(
			camps.ordinary.map((camp) => {
				return camp.interactionUnit;
			})
		);

		this.cgaa.selectorRect = new SelectorRect(this, 0, 0);
		this.cgaa.cooperation = cooperation;
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
