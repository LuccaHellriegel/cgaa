import { CircleFactory, EnemySize } from "../../../units/CircleFactory";
import { Enemies } from "../../../units/Enemies";
import { PlayerFriend } from "../../../units/PlayerFriend";
import { Point } from "../../0_GameBase/engine/types-geom";
import { CampSetup } from "../../0_GameBase/setup/CampSetup";
import { EnvSetup } from "../../0_GameBase/setup/EnvSetup";
import { GuardComponent } from "../../4_GameUnit/ai/GuardComponent";
import { FinalState } from "../../8_GameStart";
import { Pools } from "../pool/pools";

//TODO: make Enemies once they are in the PlayerCamp search these units?
//TODO: Friend Kills should give the player money
export function playerCamp(scene, realMiddlePos: Point, pools: Pools, state: FinalState, enemies: Enemies) {
	const friendPools = {
		Big: pools.friendWeapons,
		Small: null,
		Normal: null,
	};
	const friendFactory = new CircleFactory(scene, CampSetup.playerCampID, state.physics.addUnit, enemies, friendPools);

	const friends: PlayerFriend[] = [];
	const baseConfig = {
		size: "Big",
	};

	const friendConfigs = [
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
			y: realMiddlePos.y - EnvSetup.gridPartSize,
		},
		{
			...baseConfig,
			x: realMiddlePos.x + EnvSetup.gridPartSize,
			y: realMiddlePos.y + EnvSetup.gridPartSize,
		},
	];

	friendConfigs.forEach((config) => {
		let circle = friendFactory.createFriend(config.size as EnemySize);
		circle.stateHandler.setComponents([new GuardComponent(circle, circle.stateHandler)]);
		circle.setPosition(config.x, config.y);
		friends.push(circle);
	});
	return friends;
}
