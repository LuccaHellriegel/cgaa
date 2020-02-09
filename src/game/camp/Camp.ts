import { CampID, CampSetup } from "../setup/CampSetup";
import { Area } from "../env/area/Area";
import { RandomBuildingPositions } from "../building/RandomBuildingPositions";
import { GameMap } from "../env/GameMap";
import { Building } from "../building/Building";
import { BuildingFactory } from "../building/BuildingFactory";
import { CampPopulator } from "../populator/CampPopulator";
import { Gameplay } from "../../scenes/Gameplay";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { Enemies } from "../unit/Enemies";
import { GroupPool } from "../pool/GroupPool";
import { RealAreaSpawnableDict } from "../env/SpawnableDict";
import { EnvSetup } from "../setup/EnvSetup";
import { RealDict } from "../base/Dict";
import { RelPos } from "../base/RelPos";
import { CircleFactory } from "../unit/CircleFactory";
import { InteractionCircle } from "../unit/InteractionCircle";

export interface CampLike {
	populate(scene: Gameplay, pool: GroupPool, enemies: Enemies);
	id: CampID;
	area: Area;
}

export interface BuildingSpawnPair {
	building: Building;
	spawnPos: RelPos[];
}

export class Camp implements CampLike {
	buildingSetup: RandomBuildingPositions;
	buildings: Building[] = [];
	buildingSpawnPairs: BuildingSpawnPair[] = [];
	interactionUnit: InteractionCircle;

	constructor(public id: CampID, public area: Area, private gameMap: GameMap) {
		this.buildingSetup = new RandomBuildingPositions(gameMap.map, this.area, CampSetup.numbOfBuildings);
	}

	createBuildings(factory: BuildingFactory, spawnUnits: string[]) {
		this.buildingSetup.pairs.forEach(pair => {
			let building = factory.produce(pair.building, this.id, spawnUnits.pop());
			this.buildings.push(building);
			this.buildingSpawnPairs.push({ building, spawnPos: pair.spawnPos });
		});
	}

	createInteractionCircle(factory: CircleFactory) {
		let circleConfig = { ...this.area.exit.getMiddle().toPoint(), size: "Big", weaponType: "rand" };
		this.interactionUnit = factory.createInteractionCircle(circleConfig);
	}

	populate(scene: Gameplay, pool: GroupPool, enemies: Enemies) {
		new CampPopulator(scene, pool, new EnemySpawnObj(new RealAreaSpawnableDict(this.area, this.gameMap), enemies));

		//TODO wave again
		//TODO: interaction unit
	}

	createBuildingSpawnableDictsPerBuilding(): any[][] {
		//TODO: pool per building? -> otherwise pop results not in spawnUnit compliance

		let result = [];
		this.buildingSpawnPairs.forEach(pair => {
			let arr = [];
			pair.spawnPos.forEach(pos => {
				let point = pos.toPoint();
				arr.push([point, EnvSetup.walkableSymbol]);
			});
			result.push([pair.building, new RealDict(arr)]);
		});

		return result;
	}
}
