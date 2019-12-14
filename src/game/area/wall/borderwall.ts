import { StaticConfig, RelativePosition, WallBase } from "../../base/types";
import { WallsConfig, isWall } from "./wall";
import { areaSize } from "../../../globals/globalConfig";
import { wallPartHalfSize, gridPartHalfSize } from "../../../globals/globalSizes";
import { WallPart } from "./WallPart";
import { realPosToRelativePos } from "../../base/position";

function constructBorderwallConfig(staticConfig: StaticConfig): WallsConfig {
	let wallBase: WallBase = { staticConfig, sizeOfXAxis: 2 + 3 * areaSize, sizeOfYAxis: 2 + 3 * areaSize };
	let topLeftX = -wallPartHalfSize;
	let topLeftY = -wallPartHalfSize;

	return { wallBase, topLeftX, topLeftY };
}

function calculateBorderWallSize(config: WallsConfig): { width: number; height: number } {
	return {
		width: config.wallBase.sizeOfXAxis * 2 * wallPartHalfSize,
		height: config.wallBase.sizeOfYAxis * 2 * wallPartHalfSize
	};
}

function createBorderWall(config: WallsConfig): RelativePosition {
	let x = config.topLeftX;
	let y = config.topLeftY;
	for (let row = 0; row < config.wallBase.sizeOfYAxis; row++) {
		for (let column = 0; column < config.wallBase.sizeOfXAxis; column++) {
			if (isWall(config, column, row)) {
				new WallPart(config.wallBase.staticConfig.scene, x, y, config.wallBase.staticConfig.physicsGroup);
			}
			x += 2 * wallPartHalfSize;
		}
		y += 2 * wallPartHalfSize;
		x = config.topLeftX;
	}

	let size = calculateBorderWallSize(config);
	config.wallBase.staticConfig.scene.physics.world.setBounds(
		0,
		0,
		size.width - 4 * gridPartHalfSize,
		size.height - 4 * gridPartHalfSize
	);

	return realPosToRelativePos(size.width / 2, size.height / 2);
}

export function mainBorderwall(staticConfig: StaticConfig): RelativePosition {
	let borderWallConfig = constructBorderwallConfig(staticConfig);
	return createBorderWall(borderWallConfig);
}
