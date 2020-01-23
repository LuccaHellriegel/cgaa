import { Gameplay } from "../../../scenes/Gameplay";
import { HealthBar } from "./HealthBar";
import { rectBuildinghalfHeight } from "../globals/globalSizes";

const healthBarEnemyCircleConfigs = {
	Small: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 41, healthLength: 8, value: 40, scene: null },
	Normal: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 46, healthLength: 12, value: 100, scene: null },
	Big: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 51, healthLength: 17, value: 200, scene: null }
};

export class HealthBarFactory {
	private constructor() {}

	static createBuildingHealthBar(scene: Gameplay, x, y) {
		return new HealthBar(x - 25, y - rectBuildinghalfHeight, {
			posCorrectionX: 0,
			posCorrectionY: -rectBuildinghalfHeight,
			healthWidth: 46,
			healthLength: 12,
			value: 100,
			scene: scene
		});
	}

	static createEnemyCircleHealthBar(scene: Gameplay, x, y, size) {
		let healthBarConfig = healthBarEnemyCircleConfigs[size];
		healthBarConfig["scene"] = scene;
		return new HealthBar(x, y, healthBarConfig);
	}

	static createShooterHealthBar(scene: Gameplay, x, y) {
		return new HealthBar(x, y, {
			scene,
			posCorrectionX: -26,
			posCorrectionY: -38,
			healthWidth: 46,
			healthLength: 12,
			value: 100
		});
	}

	static createHealerHealthBar(scene: Gameplay, x, y) {
		return new HealthBar(x, y, {
			scene,
			posCorrectionX: -26,
			posCorrectionY: -38,
			healthWidth: 46,
			healthLength: 12,
			value: 100
		});
	}
}
