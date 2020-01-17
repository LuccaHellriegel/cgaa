import { Building, BuildingSpawnConfig } from "./Building";
import { relativeCoordinateToReal } from "../../../base/position";
import { HealthBar } from "../../../base/classes/HealthBar";
import { rectBuildinghalfHeight, circleSizeNames } from "../../../base/globals/globalSizes";
import { Gameplay } from "../../../../scenes/Gameplay";
import { removeEle } from "../../../base/utils";

export class CampBuildings {
	buildings: Building[] = [];

	constructor(
		private scene: Gameplay,
		private spawnPositions: number[][],
		private spawnConfig: BuildingSpawnConfig,
		public color: string,
		private physicsGroup: Phaser.Physics.Arcade.StaticGroup
	) {
		this.spawnBuildings();
	}

	private spawnBuildings() {
		for (let index = 0, length = this.spawnPositions.length; index < length; index++) {
			let pos = this.spawnPositions[index];

			let x = relativeCoordinateToReal(pos[0]);
			let y = relativeCoordinateToReal(pos[1]);

			let healthbar = new HealthBar(x - 25, y - rectBuildinghalfHeight, {
				posCorrectionX: 0,
				posCorrectionY: -rectBuildinghalfHeight,
				healthWidth: 46,
				healthLength: 12,
				value: 100,
				scene: this.scene
			});

			this.buildings.push(
				new Building(
					this.scene,
					x,
					y,
					this.physicsGroup,
					circleSizeNames[index],
					this.color,
					healthbar,
					this.spawnConfig
				)
			);
		}
	}

	remove(building: Building) {
		removeEle(building, this.buildings);
	}

	areDestroyed() {
		return this.buildings.length === 0;
	}
}
