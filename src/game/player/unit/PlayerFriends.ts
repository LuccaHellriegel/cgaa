import { Gameplay } from "../../../scenes/Gameplay";
import { EnemyFactory } from "../../enemies/unit/EnemyFactory";
import { Enemies } from "../../enemies/unit/Enemies";
import { Point } from "../../base/types";
import { gridPartHalfSize } from "../../base/globals/globalSizes";

//TODO: make Enemies once they are in the PlayerCamp search these units?
//TODO: Friend Kills should give the player money

interface FactoryConfigPairs {
	factoryFunc;
	configs: any[];
}

class Instantiator {
	constructor(private pair: FactoryConfigPairs) {}
	instantiate() {
		return Instantiator.instantiate(this.pair);
	}

	static instantiate(pair: FactoryConfigPairs) {
		return pair.configs.map(config => {
			return pair.factoryFunc(config);
		});
	}
}
export class PlayerFriends extends Instantiator {
	constructor(scene: Gameplay, physicsGroup, weaponGroup, enemies: Enemies, realMiddlePos: Point) {
		let baseConfig = {
			scene: scene,
			color: "blue",
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
			{ ...baseConfig, x: realMiddlePos.x, y: realMiddlePos.y - 2 * gridPartHalfSize },
			{ ...baseConfig, x: realMiddlePos.x, y: realMiddlePos.y + 2 * gridPartHalfSize },
			//Middle column
			{ ...baseConfig, x: realMiddlePos.x - 2 * gridPartHalfSize, y: realMiddlePos.y },
			{ ...baseConfig, x: realMiddlePos.x - 2 * gridPartHalfSize, y: realMiddlePos.y - 2 * gridPartHalfSize },
			{ ...baseConfig, x: realMiddlePos.x - 2 * gridPartHalfSize, y: realMiddlePos.y + 2 * gridPartHalfSize },
			//Right column
			{ ...baseConfig, x: realMiddlePos.x + 2 * gridPartHalfSize, y: realMiddlePos.y, size: "Big" },
			{
				...baseConfig,
				x: realMiddlePos.x + 2 * gridPartHalfSize,
				y: realMiddlePos.y - 2 * gridPartHalfSize,
				size: "Big"
			},
			{
				...baseConfig,
				x: realMiddlePos.x + 2 * gridPartHalfSize,
				y: realMiddlePos.y + 2 * gridPartHalfSize,
				size: "Big"
			}
		];

		let friendPairs: FactoryConfigPairs = {
			configs: friendConfigs,
			factoryFunc: config => {
				//TODO: remove need for enemies here
				return EnemyFactory.createEnemy(config, enemies);
			}
		};
		super(friendPairs);

		this.instantiate();
	}
}
