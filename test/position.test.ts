import { expect } from "chai";
import { gridPartHalfSize } from "../src/game/base/globals/globalSizes";
import {
	snapXYToGrid,
	snapCoordinateToGrid,
	exitToGlobalPoint,
	exitToGlobalRelativePosition,
	relativePositionToPoint,
	relativeCoordinateToReal,
	realCoordinateToRelative
} from "../src/game/base/position";

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
	describe("relativeCoordinateToReal", function() {
		it("", function() {
			expect(relativeCoordinateToReal(0)).to.equal(1 * gridPartHalfSize);
			expect(relativeCoordinateToReal(1)).to.equal(3 * gridPartHalfSize);
			expect(relativeCoordinateToReal(2)).to.equal(5 * gridPartHalfSize);
			expect(relativeCoordinateToReal(3)).to.equal(7 * gridPartHalfSize);
		});
	});

	describe("realCoordinateToRelative", function() {
		it("", function() {
			expect(realCoordinateToRelative(1 * gridPartHalfSize)).to.equal(0);
			expect(realCoordinateToRelative(3 * gridPartHalfSize)).to.equal(1);
			expect(realCoordinateToRelative(5 * gridPartHalfSize)).to.equal(2);
			expect(realCoordinateToRelative(7 * gridPartHalfSize)).to.equal(3);
		});
	});

	describe("relativeCoordinateToReal reversed by realCoordinateToRelative", function() {
		it("", function() {
			expect(realCoordinateToRelative(relativeCoordinateToReal(0))).to.equal(0);
			expect(realCoordinateToRelative(relativeCoordinateToReal(1))).to.equal(1);
			expect(realCoordinateToRelative(relativeCoordinateToReal(2))).to.equal(2);
			expect(realCoordinateToRelative(relativeCoordinateToReal(3))).to.equal(3);
		});
	});

	describe("relativePositionToPoint", function() {
		it("", function() {
			expect(relativePositionToPoint(0, 0)).to.deep.equal({ x: 1 * gridPartHalfSize, y: 1 * gridPartHalfSize });
			expect(relativePositionToPoint(1, 1)).to.deep.equal({ x: 3 * gridPartHalfSize, y: 3 * gridPartHalfSize });
			expect(relativePositionToPoint(2, 2)).to.deep.equal({ x: 5 * gridPartHalfSize, y: 5 * gridPartHalfSize });
			expect(relativePositionToPoint(3, 3)).to.deep.equal({ x: 7 * gridPartHalfSize, y: 7 * gridPartHalfSize });
		});
	});

	describe("exitToGlobalRelativePosition", function() {
		it("0,0 topLeft coordinates", function() {
			let areaConfig = {
				exit: { exitPosition: { column: 2, row: 2 } },
				topLeftX: gridPartHalfSize,
				topLeftY: gridPartHalfSize
			};
			let relativePosition = exitToGlobalRelativePosition(areaConfig);

			expect(relativePosition).to.deep.equal({ column: 2, row: 2 });
		});
		it("1,1 topLeft coordinates", function() {
			let areaConfig = {
				exit: { exitPosition: { column: 2, row: 2 } },
				topLeftX: 3 * gridPartHalfSize,
				topLeftY: 3 * gridPartHalfSize
			};
			let relativePosition = exitToGlobalRelativePosition(areaConfig);

			expect(relativePosition).to.deep.equal({ column: 3, row: 3 });
		});
	});
	describe("exitToGlobalPoint", function() {
		it(" 0,0 topLeft coordinates", function() {
			let areaConfig = {
				exit: { exitPosition: { column: 2, row: 2 } },
				topLeftX: gridPartHalfSize,
				topLeftY: gridPartHalfSize
			};
			let point = exitToGlobalPoint(areaConfig);

			expect(point).to.deep.equal(relativePositionToPoint(2, 2));
		});
		it(" 1,1 topLeft coordinates", function() {
			let areaConfig = {
				exit: { exitPosition: { column: 2, row: 2 } },
				topLeftX: 3 * gridPartHalfSize,
				topLeftY: 3 * gridPartHalfSize
			};
			let point = exitToGlobalPoint(areaConfig);

			expect(point).to.deep.equal(relativePositionToPoint(3, 3));
		});
		it("... is reversible", function() {
			let areaConfig = {
				exit: { exitPosition: { column: 2, row: 2 } },
				topLeftX: gridPartHalfSize,
				topLeftY: gridPartHalfSize
			};
			let point = exitToGlobalPoint(areaConfig);
			let relativePosition = exitToGlobalRelativePosition(areaConfig);

			expect(point).to.deep.equal(relativePositionToPoint(relativePosition.column, relativePosition.row));
		});
	});
});
