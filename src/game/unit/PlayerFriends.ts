import { Gameplay } from "../../scenes/Gameplay";
import { EnvSetup } from "../setup/EnvSetup";
import { CircleFactory, EnemySize } from "./CircleFactory";
import { Point } from "../base/types";

//TODO: make Enemies once they are in the PlayerCamp search these units?
//TODO: Friend Kills should give the player money
export class PlayerFriends {
	constructor(scene: Gameplay, physicsGroup, weaponGroup, realMiddlePos: Point, factory: CircleFactory) {
		let baseConfig = {
			scene: scene,
			campID: "blue",
			size: "Big",
			x: 100,
			y: 100,
			weaponType: "chain",
			physicsGroup,
			weaponGroup
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
			{ ...baseConfig, x: realMiddlePos.x + EnvSetup.gridPartSize, y: realMiddlePos.y, size: "Big" },
			{
				...baseConfig,
				x: realMiddlePos.x + EnvSetup.gridPartSize,
				y: realMiddlePos.y - EnvSetup.gridPartSize,
				size: "Big"
			},
			{
				...baseConfig,
				x: realMiddlePos.x + EnvSetup.gridPartSize,
				y: realMiddlePos.y + EnvSetup.gridPartSize,
				size: "Big"
			}
		];

		//TODO: string vs type errors
		friendConfigs.forEach(config => {
			let circle = factory.createEnemy(config.size as EnemySize);
			//TODO: replace base config with factory internals
			//TODO: use x,y here
		});
	}
}
