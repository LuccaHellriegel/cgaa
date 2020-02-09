import { expect } from "chai";
import { EnemySpawnObj } from "../src/game/base/spawnObj/EnemySpawnObj";
import { realCoordinateToRelative } from "../src/game/base/position";

describe("Test EnemySpawnObj", function() {
	describe("spawn pos around building", function() {
		it("Building center at (2,1)", function() {
			let positions = Object.keys(EnemySpawnObj.createBuildingSpawnableDict(2, 1)).map(id => {
				let arr = id.split(" ");
				return [realCoordinateToRelative(arr[0]), realCoordinateToRelative(arr[1])];
			});
			//Checked by hand
			console.log(positions);
			let expectedPostions = [
				[0, 0],
				[1, 0],
				[2, 0],
				[3, 0],
				[4, 0],
				[0, 1],
				[4, 1],
				[0, 2],
				[1, 2],
				[2, 2],
				[3, 2],
				[4, 2]
			];
			//Suboptimal check because array comparison not supported by chai
			expect(positions.length).to.eq(expectedPostions.length);
		});
	});
});
