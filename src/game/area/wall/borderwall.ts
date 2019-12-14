import { StaticConfig, RelativePosition, WallBase } from "../../base/types";
import { WallsConfig, isWall } from "./wall";
import { areaSize } from "../../base/globals/globalConfig";
import { gridPartHalfSize, gridPartHalfSize } from "../../base/globals/globalSizes";
import { realPosToRelativePos } from "../../base/position";
import { BorderWallPart } from "./BorderWallPart";

function constructBorderwallConfig(staticConfig: StaticConfig): WallsConfig {
	let wallBase: WallBase = { staticConfig, sizeOfXAxis: 2 + 3 * areaSize, sizeOfYAxis: 2 + 3 * areaSize };
	let topLeftX = -gridPartHalfSize;
	let topLeftY = -gridPartHalfSize;

	return { wallBase, topLeftX, topLeftY };
}

function calculateBorderWallSize(config: WallsConfig): { width: number; height: number } {
	return {
		width: config.wallBase.sizeOfXAxis * 2 * gridPartHalfSize,
		height: config.wallBase.sizeOfYAxis * 2 * gridPartHalfSize
	};
}

function createBorderWall(config: WallsConfig): RelativePosition {
	let x = config.topLeftX;
	let y = config.topLeftY;
	for (let row = 0; row < config.wallBase.sizeOfYAxis; row++) {
		for (let column = 0; column < config.wallBase.sizeOfXAxis; column++) {
			if (isWall(config, column, row)) {
				new BorderWallPart(config.wallBase.staticConfig.scene, x, y);
			}
			x += 2 * gridPartHalfSize;
		}
		y += 2 * gridPartHalfSize;
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
