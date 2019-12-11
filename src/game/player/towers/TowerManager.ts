import { Tower } from "./Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { towerCost } from "../../../globals/globalConfig";
import { TowerSpawnMap } from "../../spawn/TowerSpawnMap";
import { GhostTower } from "../modi/GhostTower";
import { gainSouls, spendSouls } from "../../base/events/player";
import { snapXYToGrid } from "../../base/map/position";

export class TowerManager {
	towerGroup: Phaser.Physics.Arcade.StaticGroup;
	scene: Gameplay;
	sightGroup: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Phaser.Physics.Arcade.Group;
	towers: Tower[] = [];
	towerSpawnMap: TowerSpawnMap;
	canBuild = false;
	ghostTower: GhostTower;

	constructor(
		scene: Gameplay,
		towerGroup,
		sightGroup,
		bulletGroup,
		towerSpawnMap: TowerSpawnMap,
		ghostTower: GhostTower
	) {
		this.scene = scene;

		scene.events.on("sold-tower", tower => {
			let index = this.towers.indexOf(tower);
			this.towers.splice(index, 1);
			tower.destroy();
			gainSouls(this.scene, towerCost);
		});

		scene.events.on("removed-tower", tower => {
			let index = this.towers.indexOf(tower);
			this.towers.splice(index, 1);
		});

		scene.events.on("can-build", () => {
			this.canBuild = true;
		});

		scene.events.on("can-not-build", () => {
			this.canBuild = false;
		});
		this.towerSpawnMap = towerSpawnMap;

		this.ghostTower = ghostTower;

		this.towerGroup = towerGroup;
		this.sightGroup = sightGroup;
		this.bulletGroup = bulletGroup;
	}

	private playInvalidTowerPosAnim() {
		this.ghostTower.anims.play("invalid-tower-pos");
	}

	spawnNewTower() {
		if (!this.canBuild) {
			this.playInvalidTowerPosAnim();
			return;
		}

		let x = this.ghostTower.x;
		let y = this.ghostTower.y;
		if (!(x < 0 || y < 0)) {
			let snappedXY = snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;

			if (this.towerSpawnMap.evaluateRealPos(x, y)) {
				spendSouls(this.scene, towerCost);
				let tower = new Tower(this.scene, x, y, this.towerGroup, this.sightGroup, this.bulletGroup);
				this.towers.push(tower);
			} else {
				this.playInvalidTowerPosAnim();
			}
		} else {
			this.playInvalidTowerPosAnim();
		}
	}
}
