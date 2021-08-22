import { Gameplay } from "../scenes/Gameplay";
import { CircleFactory } from "../units/CircleFactory";
import { Enemies } from "../units/Enemies";
import { InteractionCircle } from "../units/InteractionCircle";
import { Player } from "../units/Player";
import { PlayerFriend } from "../units/PlayerFriend";
import { arrayMiddle } from "./0_GameBase/engine/array";
import { RealDict } from "./0_GameBase/engine/Dict";
import { Quest } from "./0_GameBase/engine/quest/Quest";
import { Quests } from "./0_GameBase/engine/quest/Quests";
import { RelPos } from "./0_GameBase/engine/RelPos";
import { Point } from "./0_GameBase/engine/types-geom";
import { CampSetup } from "./0_GameBase/setup/CampSetup";
import { EnvSetup } from "./0_GameBase/setup/EnvSetup";
import { EventSetup } from "./0_GameBase/setup/EventSetup";
import { mapSpawnablePos } from "./3_GameData/layout";
import { Building } from "../buildings/Building";
import { State } from "./5_GameState";
import { Rivalries } from "./5_GameState/state/Rivalries";
import { Physics } from "./6_GamePhysics";
import { BuildManager } from "./7_GameUI/build/BuildManager";
import { SelectorRect } from "./7_GameUI/SelectorRect";
import { bossCamp } from "./8_GameStart/camp/boss/bossCamp";
import { campsStaticUnits, populateCamps } from "./8_GameStart/camp/camps";
import { CampsState } from "./8_GameStart/camp/CampsState";
import { playerCamp } from "./8_GameStart/camp/playerCamp";
import { Movement } from "./8_GameStart/input/Movement";
import { playerInput } from "./8_GameStart/input/playerInput";
import { Spawner } from "./8_GameStart/input/Spawner";
import { DangerousCirclePool } from "./8_GameStart/pool/CirclePool";
import { Pools, initPools } from "./8_GameStart/pool/pools";
import { EnemySpawnObj } from "./8_GameStart/spawn/EnemySpawnObj";
import { WaveController } from "./8_GameStart/wave/WaveController";
import { WaveOrder } from "./8_GameStart/wave/WaveOrder";
import { WavePopulator } from "./8_GameStart/wave/WavePopulator";

class WallSide extends Phaser.Physics.Arcade.Image {
	constructor(scene: Gameplay, x: number, y: number, width, height, addEnv) {
		super(scene, x, y, "");
		scene.add.existing(this);
		addEnv(this);
		this.setSize(width, height).setVisible(false).setActive(false);
	}
}

function addWallside(scene: Gameplay, addEnv, partPositions: Point[]) {
	partPositions.forEach((partPosition) => {
		scene.add.image(partPosition.x, partPosition.y, "wallPart");
	});

	const firstPositionX = partPositions[0].x;
	const lastPositionX = partPositions[partPositions.length - 1].x;
	const width = lastPositionX - firstPositionX + EnvSetup.gridPartSize;

	const firstPositionY = partPositions[0].y;
	const lastPositionY = partPositions[partPositions.length - 1].y;
	const height = lastPositionY - firstPositionY + EnvSetup.gridPartSize;

	const middleX = firstPositionX + width / 2 - EnvSetup.halfGridPartSize;
	const middleY = firstPositionY + height / 2 - EnvSetup.halfGridPartSize;
	new WallSide(scene, middleX, middleY, width, height, addEnv);
}

function initQuests(scene, rivalries: Rivalries, quests: Quests, diplomats: InteractionCircle[][]) {
	CampSetup.ordinaryCampIDs.forEach((id) => {
		const rivalID = rivalries.getRival(id);
		const amountToKill = CampSetup.numbOfDiplomats + CampSetup.numbOfBuildings;
		const quest = Quest.killQuest(
			scene,
			rivalries,
			quests,
			id,
			scene.events,
			EventSetup.unitKilledEvent,
			rivalID,
			amountToKill,
			EventSetup.essentialUnitsKilled,
			rivalID
		);
		quests.set(id, quest);

		for (const diplomatArr of diplomats) {
			for (const diplomat of diplomatArr) {
				if (diplomat.campID == id) {
					diplomat.setQuest(quest);
				}
			}
		}
	});
}

function createBuildingSpawnableDictsPerBuilding(buildingPos: { spawnPos: RelPos[]; positionInMap: RelPos }): RealDict {
	let arr = [];
	buildingPos.spawnPos.forEach((pos) => {
		let point = pos.toPoint();
		arr.push([point, EnvSetup.walkableSymbol]);
	});
	return new RealDict(arr);
}

function waveProducer(
	scene,
	campsState: CampsState,
	state: FinalState,
	pools: Pools,
	enemies: Enemies,
	waveOrder: WaveOrder,
	staticUnits
) {
	for (const units of staticUnits) {
		for (const building of units.buildings) {
			for (const pos of state.camps.get((building as Building).campID).buildingPositionsInMap) {
				const point = pos.positionInMap.toPoint();
				if (building.x == point.x && building.y == point.y) {
					const spawnDict = createBuildingSpawnableDictsPerBuilding(pos);
					new WavePopulator(
						scene,
						building.campID,
						new DangerousCirclePool(
							scene,
							8,
							new CircleFactory(scene, building.campID, state.physics.addUnit, enemies, pools.weapons[building.campID]),
							enemies,
							building.spawnUnit
						),
						new EnemySpawnObj(spawnDict, enemies),
						state.pathAssigner,
						campsState,
						building.id
					);
					break;
				}
			}
		}
	}

	return () => {
		new WaveController(scene, waveOrder);
	};
}

export interface FinalState extends State {
	physics: Physics;
}

export interface CGAA extends FinalState {
	startWaves: Function;
	diplomats: InteractionCircle[][];
	input: { spawners: Spawner[]; selectorRect: SelectorRect; build: BuildManager; movement: Movement };
	player: Player;
	friends: PlayerFriend[];
	waveOrder: WaveOrder;
}

export function GameStart(scene, state: FinalState): CGAA {
	state.wallSides.forEach((wallSide) => {
		addWallside(
			scene,
			state.physics.addEnv,
			wallSide.positionsInMap.map((pos) => pos.toPoint())
		);
	});

	const enemies = new Enemies();

	// Assumes player camp has only one exit
	const playerExit = arrayMiddle(
		state.camps.get(CampSetup.playerCampID).exitPositionsInMap[0].positionsInMap
	).toPoint();
	const player = Player.withChainWeapon(scene, playerExit.x, playerExit.y);
	state.physics.addUnit(player);

	const pools = initPools(scene, state.physics.addTower, state.physics.addBullet, player);

	const staticUnits = campsStaticUnits(scene, state.camps, state.physics, enemies, pools.weapons);
	const campsState = new CampsState(
		scene,
		staticUnits.map((units) => {
			return units.buildings;
		})
	);

	const mapSpawnPos = mapSpawnablePos(state.gameMap, state.mapDefaultSymbol, state.exits);
	populateCamps(scene, state.camps, enemies, campsState, mapSpawnPos, state, pools);

	bossCamp(scene, state, enemies, pools, campsState, mapSpawnPos);

	const friends = playerCamp(
		scene,
		state.camps.get(CampSetup.playerCampID).areaMapMiddle.toPoint(),
		pools,
		state,
		enemies
	);
	const input = playerInput(scene, player, mapSpawnPos, enemies, pools);

	const diplomats = staticUnits.map((units) => {
		return units.diplomats;
	});
	initQuests(scene, state.rivalries, state.quests, diplomats);

	const waveOrder = new WaveOrder(campsState);

	return {
		...state,
		input,
		diplomats,
		startWaves: waveProducer(scene, campsState, state, pools, enemies, waveOrder, staticUnits),
		player,
		waveOrder,
		friends,
	};
}
