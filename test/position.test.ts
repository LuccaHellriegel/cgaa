import { expect } from "chai";
import { gridPartHalfSize } from "../src/globals/globalSizes";
import { snapXYToGrid, snapCoordinateToGrid } from "../src/game/base/map/position";

describe("Test position", function() {
	describe("Snap real pos to real grid pos", function() {
		it("X and Y should be snapped back to 200", function() {
			let { newX, newY } = snapXYToGrid(5 * gridPartHalfSize - 7, 5 * gridPartHalfSize - 7);

			expect(newX).to.equal(5 * gridPartHalfSize);
			expect(newY).to.equal(5 * gridPartHalfSize);
		});
		it("X and Y should remain 200", function() {
			let { newX, newY } = snapXYToGrid(5 * gridPartHalfSize, 5 * gridPartHalfSize);

			expect(newX).to.equal(5 * gridPartHalfSize);
			expect(newY).to.equal(5 * gridPartHalfSize);
		});
		it("If X and Y is between tiles it should go to the closest (the right one)", function() {
			let { newX, newY } = snapXYToGrid(2 * gridPartHalfSize + 2, gridPartHalfSize);

			expect(newX).to.equal(3 * gridPartHalfSize);
			expect(newY).to.equal(gridPartHalfSize);
		});
		it("If X and Y is between tiles it should go to the closest (the left one)", function() {
			let { newX, newY } = snapXYToGrid(2 * gridPartHalfSize - 2, gridPartHalfSize);

			expect(newX).to.equal(gridPartHalfSize);
			expect(newY).to.equal(gridPartHalfSize);
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
	// 		let element = { x: 3 * gridPartHalfSize, y: 3 * gridPartHalfSize };
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
