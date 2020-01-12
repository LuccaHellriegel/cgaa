import { Gameplay } from "../../../../scenes/Gameplay";
import { EnemyPool } from "./EnemyPool";
import { EnemySpawnObj } from "../../../base/spawn/EnemySpawnObj";
import { constructXYID } from "../../../base/id";

let bigCircleWithRand = { weaponType: "rand", size: "Big" };
let bigCircleWithChain = { weaponType: "chain", size: "Big" };
let normalCircleWithRand = { weaponType: "rand", size: "Normal" };
let normalCircleWithChain = { weaponType: "chain", size: "Normal" };
const buildingGroupComposition = [bigCircleWithRand, bigCircleWithChain, normalCircleWithRand, normalCircleWithChain];

export function setupBuildingPopulation(scene: Gameplay, color: string, buildingID: string) {
	console.log(scene.cgaa.camps[color].buildingPopulation);
	scene.cgaa.camps[color].buildingPopulation[buildingID].enemyPool = new EnemyPool({
		enemyConfig: scene.cgaa.camps[color].buildingPopulation[buildingID].enemyConfig,
		numberOfGroups: 1,
		groupComposition: buildingGroupComposition
	});

	scene.events.once("start-wave-" + color, () => {
		startWave(scene, color, buildingID);
	});
}

function startWave(scene: Gameplay, color: string, buildingID: string) {
	let enemyPool = scene.cgaa.camps[color].buildingPopulation[buildingID].enemyPool;
	let enemySpawnObj = scene.cgaa.camps[color].buildingPopulation[buildingID].enemySpawnObj;
	let campIsDestroyed = scene.cgaa.camps[color].buildings.length === 0;
	if (campIsDestroyed) {
		enemyPool.destroy();
		return;
	}

	let leftToSpawn = 3;
	spawnEnemy(scene, enemySpawnObj, enemyPool, leftToSpawn);
	scene.events.once("start-wave-" + color, () => {
		startWave(scene, color, buildingID);
	});
}

function spawnEnemy(scene: Gameplay, enemySpawnObj: EnemySpawnObj, enemyPool: EnemyPool, leftToSpawn: number) {
	let spawnPosition = enemySpawnObj.getRandomSpawnPosition();
	if (spawnPosition) {
		let enemy = enemyPool.pop();

		if (scene.cgaa.camps[enemy.color].buildings.length === 0) {
			enemy.destroy();
			return;
		}

		let id = constructXYID(spawnPosition[0], spawnPosition[1]);
		if (scene.cgaa.camps[enemy.color].rerouteColor !== "") {
			id += " " + scene.cgaa.camps[enemy.color].rerouteColor;
		}

		enemy.pathContainer = scene.cgaa.pathDict[id];
		enemy.state = "ambush";
		enemy.poolActivate(spawnPosition[0], spawnPosition[1]);
		enemySpawnObj.add(enemy);
		leftToSpawn--;
	}
	if (leftToSpawn > 0) {
		scene.time.addEvent({
			delay: 4000,
			callback: () => {
				spawnEnemy(scene, enemySpawnObj, enemyPool, leftToSpawn);
			},
			repeat: 0
		});
	}
}
