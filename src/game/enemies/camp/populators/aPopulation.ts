import { Gameplay } from "../../../../scenes/Gameplay";
import { EnemyPool } from "./EnemyPool";
import { EnemyConfig } from "../unit/EnemyFactory";
import { EnemySpawnObj } from "../../../base/spawn/EnemySpawnObj";

let bigCircleWithRand = { weaponType: "rand", size: "Big" };
let bigCircleWithChain = { weaponType: "chain", size: "Big" };
let normalCircleWithRand = { weaponType: "rand", size: "Normal" };
let normalCircleWithChain = { weaponType: "chain", size: "Normal" };
const areaGroupComposition = [
	bigCircleWithRand,
	bigCircleWithChain,
	bigCircleWithChain,
	normalCircleWithRand,
	normalCircleWithChain
];

const areaMaxPopulation = 5;

export function setupAreaPopulation(scene: Gameplay, color: string) {
	scene.cgaa.camps[color].area.enemyPool = new EnemyPool({
		enemyConfig: scene.cgaa.camps[color].area.enemyConfig,
		numberOfGroups: 4,
		groupComposition: areaGroupComposition
	});

	scene.events.once("start-wave-" + color, () => {
		startWave(scene, color);
	});
}

function startWave(scene: Gameplay, color: string) {
	let enemyPool = scene.cgaa.camps[color].area.enemyPool;
	let enemySpawnObj = scene.cgaa.camps[color].area.enemySpawnObj;
	let campIsDestroyed = scene.cgaa.camps[color].buildings.length === 0;
	if (campIsDestroyed) {
		enemyPool.destroy();
		return;
	}
	let areaIsPopulated = enemyPool.activeIDArr.length === areaMaxPopulation;
	if (!areaIsPopulated) {
		let leftToSpawn = areaMaxPopulation - enemyPool.activeIDArr.length;
		spawnEnemy(scene, enemySpawnObj, enemyPool, leftToSpawn);
	}

	scene.events.once("start-wave-" + color, () => {
		startWave(scene, color);
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

		enemy.state = "guard";
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
