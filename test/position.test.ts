import { expect } from "chai";
import { wallPartHalfSize } from "../src/globals/globalSizes";
import { snapXYToGrid, snapCoordinateToGrid } from "../src/game/base/map/position";

describe("Test position", function() {
	describe("Snap real pos to real grid pos", function() {
		it("X and Y should be snapped back to 200", function() {
			let { newX, newY } = snapXYToGrid(5 * wallPartHalfSize - 7, 5 * wallPartHalfSize - 7);

			expect(newX).to.equal(5 * wallPartHalfSize);
			expect(newY).to.equal(5 * wallPartHalfSize);
		});
		it("X and Y should remain 200", function() {
			let { newX, newY } = snapXYToGrid(5 * wallPartHalfSize, 5 * wallPartHalfSize);

			expect(newX).to.equal(5 * wallPartHalfSize);
			expect(newY).to.equal(5 * wallPartHalfSize);
		});
		it("If X and Y is between tiles it should go to the closest (the right one)", function() {
			let { newX, newY } = snapXYToGrid(2 * wallPartHalfSize + 2, wallPartHalfSize);

			expect(newX).to.equal(3 * wallPartHalfSize);
			expect(newY).to.equal(wallPartHalfSize);
		});
		it("If X and Y is between tiles it should go to the closest (the left one)", function() {
			let { newX, newY } = snapXYToGrid(2 * wallPartHalfSize - 2, wallPartHalfSize);

			expect(newX).to.equal(wallPartHalfSize);
			expect(newY).to.equal(wallPartHalfSize);
		});
		it("560 is between tiles and should be snapped left ", function() {
			let newX = snapCoordinateToGrid(560);

			expect(newX).to.equal(520);
		});
		it("1040 is between tiles and should be snapped left ", function() {
			let newX = snapCoordinateToGrid(1040);

			expect(newX).to.equal(1000);
		});
	});

	// describe("getRelativePosOfElementsAndAroundElements", function() {
	// 	it("Element is in (1,1) and around elements form circle", function() {
	// 		let element = { x: 3 * wallPartHalfSize, y: 3 * wallPartHalfSize };
	// 		let relativePositions = getRelativePosOfElementsAndAroundElements([element], 1, 1);
	// 		let expectedPositions = [
	// 			{ row: 0, column: 0 },
	// 			{ row: 0, column: 1 },
	// 			{ row: 0, column: 2 },
	// 			{ row: 1, column: 0 },
	// 			{ row: 1, column: 1 },
	// 			{ row: 1, column: 2 },
	// 			{ row: 2, column: 0 },
	// 			{ row: 2, column: 1 },
	// 			{ row: 2, column: 2 }
	// 		];

	// 		expectedPositions.forEach(pos => expect(relativePositions).to.deep.include(pos));
	// 	});
	// });
});
