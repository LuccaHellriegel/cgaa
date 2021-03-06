import { CampMap } from "../../3_GameData";
import { BuildingFactory } from "../../4_GameUnit/building/BuildingFactory";
import { Physics } from "../../6_GamePhysics";
import { UnitSetup } from "../../0_GameBase/setup/UnitSetup";
import { Building } from "../../4_GameUnit/building/Building";
import { CampID, CampSetup } from "../../0_GameBase/setup/CampSetup";
import { arrayMiddle } from "../../0_GameBase/engine/array";
import { InteractionCircle } from "../../4_GameUnit/unit/InteractionCircle";
import { CircleFactory } from "../../4_GameUnit/unit/CircleFactory";
import { Enemies } from "../../4_GameUnit/unit/Enemies";
import { CampPopulator } from "./CampPopulator";
import { CampsState } from "./CampsState";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { filterRelPosInsideArea, layoutAreaToMapTopLeft } from "../../3_GameData/layout";
import { RelPos } from "../../0_GameBase/engine/RelPos";
import { EnvSetup } from "../../0_GameBase/setup/EnvSetup";
import { RealDict } from "../../0_GameBase/engine/Dict";
import { DangerousCirclePool } from "../pool/CirclePool";
import { Pools } from "../pool/pools";
import { Camp } from "../../0_GameBase/types";
import { FinalState } from "../../8_GameStart";

function createBuildings(camp: Camp, factory: BuildingFactory, spawnUnits: string[]) {
	const result: Building[] = [];
	const spawnUnitStrings = [...spawnUnits];

	for (const buildingPos of camp.buildingPositionsInMap) {
		const building = factory.produce(buildingPos.positionInMap, camp.id as CampID, spawnUnitStrings.pop());
		result.push(building);
	}
	return result;
}

function createDiplomats(camp: Camp, factory: CircleFactory) {
	const result: InteractionCircle[] = [];
	for (const exitPosition of camp.exitPositionsInMap) {
		let circleConfig = { ...arrayMiddle(exitPosition.positionsInMap).toPoint(), size: "Big", weaponType: "chain" };
		const diplomat = factory.createInteractionCircle(circleConfig);
		result.push(diplomat);
	}
	return result;
}

export function campsStaticUnits(scene, campMap: CampMap, physics: Physics, enemies: Enemies, weaponPools) {
	const camps = campMap.values();
	const result = [];
	for (const camp of camps) {
		if (CampSetup.ordinaryCampIDs.includes(camp.id as CampID)) {
			const buildings = createBuildings(camp, new BuildingFactory(scene, physics.addBuilding), [
				...UnitSetup.circleSizeNames,
			]);
			const diplomats = createDiplomats(
				camp,
				new CircleFactory(scene, camp.id as CampID, physics.addUnit, enemies, weaponPools[camp.id])
			);
			result.push({ buildings, diplomats });
		}
	}
	return result;
}

function relPosToDictInput(pos: RelPos[]) {
	return pos.map((pos) => [pos.toPoint(), EnvSetup.walkableSymbol]);
}

export function areaRealSpawnDict(layoutArea: RelPos, areaSize, mapSpawnPos: RelPos[]) {
	const areaMapTopLeft = layoutAreaToMapTopLeft(layoutArea, areaSize);
	const areaSpawnPos = filterRelPosInsideArea(areaMapTopLeft, areaSize, mapSpawnPos);
	return new RealDict(relPosToDictInput(areaSpawnPos));
}

function populateCamp(
	scene,
	camp: Camp,
	campsState: CampsState,
	enemies: Enemies,
	pool: DangerousCirclePool,
	mapSpawnPos: RelPos[]
) {
	const spawnDict = areaRealSpawnDict(camp.areaInLayout, camp.areaSize, mapSpawnPos);
	new CampPopulator(
		camp.id as CampID,
		scene,
		pool,
		new EnemySpawnObj(spawnDict, enemies),
		UnitSetup.maxCampPopulation,
		campsState
	);
}

export function populateCamps(
	scene,
	campMap: CampMap,
	enemies: Enemies,
	campsState: CampsState,
	mapSpawnPos: RelPos[],
	state: FinalState,
	pools: Pools
) {
	const camps = campMap.values();

	for (const camp of camps) {
		if (CampSetup.ordinaryCampIDs.includes(camp.id as CampID))
			populateCamp(
				scene,
				camp,
				campsState,
				enemies,
				new DangerousCirclePool(
					scene,
					UnitSetup.campSize,
					new CircleFactory(scene, camp.id, state.physics.addUnit, enemies, pools.weapons[camp.id]),
					enemies,
					"Big"
				),
				mapSpawnPos
			);
	}
}
