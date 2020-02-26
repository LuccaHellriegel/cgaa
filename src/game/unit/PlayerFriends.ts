import { EnvSetup } from "../setup/EnvSetup";
import { CircleFactory, EnemySize } from "./CircleFactory";
import { Point } from "../base/types";
import { GuardComponent } from "../ai/GuardComponent";

//TODO: make Enemies once they are in the PlayerCamp search these units?
//TODO: Friend Kills should give the player money
export class PlayerFriends {
	constructor(realMiddlePos: Point, factory: CircleFactory) {
		let baseConfig = {
			size: "Big"
		};

		let friendConfigs = [
			//First column
			{ ...baseConfig, x: realMiddlePos.x, y: realMiddlePos.y },
			{ ...baseConfig, x: realMiddlePos.x, y: realMiddlePos.y - EnvSetup.gridPartSize },
			{ ...baseConfig, x: realMiddlePos.x, y: realMiddlePos.y + EnvSetup.gridPartSize },
			//Middle column
			{ ...baseConfig, x: realMiddlePos.x - EnvSetup.gridPartSize, y: realMiddlePos.y },
			{ ...baseConfig, x: realMiddlePos.x - EnvSetup.gridPartSize, y: realMiddlePos.y - EnvSetup.gridPartSize },
			{ ...baseConfig, x: realMiddlePos.x - EnvSetup.gridPartSize, y: realMiddlePos.y + EnvSetup.gridPartSize },
			//Right column
			{ ...baseConfig, x: realMiddlePos.x + EnvSetup.gridPartSize, y: realMiddlePos.y },
			{
				...baseConfig,
				x: realMiddlePos.x + EnvSetup.gridPartSize,
				y: realMiddlePos.y - EnvSetup.gridPartSize
			},
			{
				...baseConfig,
				x: realMiddlePos.x + EnvSetup.gridPartSize,
				y: realMiddlePos.y + EnvSetup.gridPartSize
			}
		];

		friendConfigs.forEach(config => {
			let circle = factory.createEnemy(config.size as EnemySize);
			circle.stateHandler.setComponents([new GuardComponent(circle, circle.stateHandler)]);
			circle.setPosition(config.x, config.y);
		});
	}
}
