import { generateTextures } from "../graphics/texture/texture";
import { createAnims } from "../graphics/animation/animation";
import { Paths } from "../game/path/Paths";
import { Orientation } from "../game/path/Orientation";
import { Areas } from "../game/env/area/Areas";
import { WallFactory } from "../game/env/wall/WallFactory";
import { Collision } from "../game/collision/Collision";
import { CampOrder } from "../game/camp/CampOrder";
import { Camps } from "../game/camp/Camps";
import { GameMap } from "../game/env/GameMap";
import { CampExits } from "../game/camp/CampExits";
import { PathFactory } from "../game/path/PathFactory";
import { PathCalculator } from "../game/path/PathCalculator";
import { PathConfig } from "../game/path/PathConfig";
import { Enemies } from "../game/unit/Enemies";
import { EnemyPool } from "../game/pool/EnemyPool";
import { UnitSetup } from "../game/setup/UnitSetup";
import { CircleFactory } from "../game/unit/CircleFactory";
import { Player } from "../game/unit/Player";
import { Movement } from "../game/input/Movement";
import { WASD } from "../game/input/WASD";
import { Mouse } from "../game/input/Mouse";
import { SelectorRect } from "../game/modi/SelectorRect";
import { Modi } from "../game/modi/Modi";
import { Inputs } from "../game/input/Inputs";
import { BuildModus } from "../game/modi/build/BuildModus";
import { Spawner } from "../game/pool/Spawner";
import { HealerPool } from "../game/pool/HealerPool";
import { TowerSpawnObj } from "../game/spawn/TowerSpawnObj";
import { TowerSetup } from "../game/setup/TowerSetup";
import { ShooterPool } from "../game/pool/ShooterPool";
import { InteractionModus } from "../game/modi/interaction/InteractionModus";
import { Cooperation } from "../game/state/Cooperation";
import { Quests } from "../game/state/Quests";
import { CampRouting } from "../game/camp/CampRouting";
import { Rivalries } from "../game/state/Rivalries";
import { UnitCollection } from "../game/base/UnitCollection";
import { BuildingFactory } from "../game/building/BuildingFactory";
import { BossCamp } from "../game/camp/BossCamp";
import { BossPool } from "../game/pool/BossPool";
import { BossSetup } from "../game/setup/BossSetup";
import { CampSetup } from "../game/setup/CampSetup";
import { WavePopulator } from "../game/wave/WavePopulator";
import { WaveSetup } from "../game/setup/WaveSetup";
import { EnemySpawnObj } from "../game/spawn/EnemySpawnObj";
import { PathAssigner } from "../game/path/PathAssigner";
import { CampsState } from "../game/state/CampsState";
import { WaveController } from "../game/wave/WaveController";
import { WaveOrder } from "../game/wave/WaveOrder";
import { Building } from "../game/building/Building";

export class Gameplay extends Phaser.Scene {
	cgaa: any = {};

	constructor() {
		super("Gameplay");
	}

	preload() {
		generateTextures(this);
		createAnims(this.anims);
	}

	create() {
		//Setup minimal Game State for collision handling
		let rivalries = new Rivalries();
		let router = new CampRouting(this.events, rivalries);
		let cooperation = new Cooperation(router);

		//Setup Physics and Sight
		let collision = new Collision(this, cooperation);

		//Setup Environment
		let wallFactory = new WallFactory(this, collision.physicGroups.areas);
		let areas = new Areas(wallFactory);
		let gameMap = new GameMap(areas);

		//Setup Camps
		let enemies = new Enemies();
		let order = new CampOrder();
		let camps = new Camps(order, areas, gameMap);
		gameMap.updateWith(camps);
		camps.ordinary.forEach(camp => {
			camp.createBuildings(new BuildingFactory(this, collision.physicGroups.buildings[camp.id]), [
				...UnitSetup.circleSizeNames
			]);

			let factory = new CircleFactory(this, camp.id, collision.physicGroups.pairs[camp.id], enemies);
			camp.populate(
				this,
				new EnemyPool(this, UnitSetup.groupSize, UnitSetup.campGroupComposition, enemies, factory),
				enemies
			);
			camp.createInteractionCircle(factory);
		});
		let campsState = new CampsState(
			this,
			camps.ordinary.map(camp => camp.buildings)
		);

		//Setup GameState
		let essentialDict = camps.ordinary.reduce((prev, cur) => {
			prev[cur.id] = (cur.buildings as any[]).concat(cur.interactionUnit);
			return prev;
		}, {});

		let quests = new Quests(this, rivalries, essentialDict);
		cooperation.setQuests(quests);

		//Setup Boss
		new BossCamp(camps.boss.area, gameMap).populate(
			this,
			new BossPool(
				this,
				BossSetup.bossGroupSize,
				BossSetup.bossCampGroupComposition,
				enemies,
				new CircleFactory(this, CampSetup.bossCampID, collision.physicGroups.pairs[CampSetup.bossCampID], enemies)
			),
			enemies
		);

		//Setup Pathfinding
		let orientation = new Orientation(
			gameMap.getMiddle(),
			camps.player.area.getMiddle(),
			camps.boss.area.getMiddle(),
			camps
		);
		let exits = new CampExits(areas.exits, order);
		let configs = PathConfig.createConfigs(orientation, exits, camps.arr);
		let paths = new Paths(orientation, PathFactory.produce(new PathCalculator(gameMap.map), configs));
		let assigner = new PathAssigner(paths, router);

		//Setup Waves
		this.cgaa.waveOrder = new WaveOrder(campsState);
		CampSetup.ordinaryCampIDs.forEach(campID => {
			camps
				.get(campID)
				.createBuildingSpawnableDictsPerBuilding()
				.forEach(pair => {
					new WavePopulator(
						this,
						campID,
						new EnemyPool(
							this,
							1,
							WaveSetup.groupCompDict[(pair[0] as Building).spawnUnit],
							enemies,
							new CircleFactory(this, campID, collision.physicGroups.pairs[campID], enemies)
						),
						new EnemySpawnObj(pair[1], enemies),
						assigner,
						campsState,
						(pair[0] as Building).id
					);
				});
		});

		//Setup Player
		let player = Player.withChainWeapon(this, collision.physicGroups.player, collision.physicGroups.playerWeapon);
		this.cameras.main.startFollow(player);
		this.cgaa.movement = new Movement(new WASD(this), player);

		//Setup Mouse Modes
		let towerSpawnObj = new TowerSpawnObj(gameMap.getSpawnableDict(), enemies);
		let healerPool = new HealerPool(
			this,
			TowerSetup.towerGroupSize,
			collision.physicGroups.shooter,
			collision.physicGroups.healer
		);
		let healerSpawner = Spawner.createHealerSpawner(this, healerPool, towerSpawnObj);

		let shooterPool = new ShooterPool(
			this,
			TowerSetup.towerGroupSize,
			collision.physicGroups.shooter,
			collision.physicGroups.shooterBulletGroup
		);
		let shooterSpawner = Spawner.createShooterSpawner(this, shooterPool, towerSpawnObj);
		let spawners = [shooterSpawner, healerSpawner];
		let buildMode = new BuildModus(spawners);
		let interactionCollection = new UnitCollection(
			camps.ordinary.map(camp => {
				return camp.interactionUnit;
			})
		);

		let interactionMode = new InteractionModus(cooperation, interactionCollection);
		let selectorRect = new SelectorRect(this, 0, 0);
		this.cgaa.inputs = new Inputs(this);
		new Mouse(this, player, selectorRect, new Modi(this.cgaa.inputs, buildMode, interactionMode, selectorRect));
	}

	startWaves() {
		new WaveController(this, this.cgaa.waveOrder);
	}

	update() {
		this.cgaa.movement.update();
	}
}
