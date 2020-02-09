import { expect } from "chai";
import { EnvSetup.halfGridPartSize } from "../src/game/base/globals/globalSizes";
import {
	snapXYToGrid,
	snapCoordinateToGrid,
	relativePositionToPoint,
	relativeCoordinateToReal,
	realCoordinateToRelative
} from "../src/game/base/position";

describe("Test position", function() {
	describe("Snap real pos to real grid pos", function() {
		it("X and Y should be snapped back to 200", function() {
			let { newX, newY } = snapXYToGrid(5 * EnvSetup.halfGridPartSize - 7, 5 * EnvSetup.halfGridPartSize - 7);

			expect(newX).to.equal(5 * EnvSetup.halfGridPartSize);
			expect(newY).to.equal(5 * EnvSetup.halfGridPartSize);
		});
		it("X and Y should remain 200", function() {
			let { newX, newY } = snapXYToGrid(5 * EnvSetup.halfGridPartSize, 5 * EnvSetup.halfGridPartSize);

			expect(newX).to.equal(5 * EnvSetup.halfGridPartSize);
			expect(newY).to.equal(5 * EnvSetup.halfGridPartSize);
		});
		it("If X and Y is between tiles it should go to the closest (the right one)", function() {
			let { newX, newY } = snapXYToGrid(EnvSetup.gridPartSize + 2, EnvSetup.halfGridPartSize);

			expect(newX).to.equal(3 * EnvSetup.halfGridPartSize);
			expect(newY).to.equal(EnvSetup.halfGridPartSize);
		});
		it("If X and Y is between tiles it should go to the closest (the left one)", function() {
			let { newX, newY } = snapXYToGrid(EnvSetup.gridPartSize - 2, EnvSetup.halfGridPartSize);

			expect(newX).to.equal(EnvSetup.halfGridPartSize);
			expect(newY).to.equal(EnvSetup.halfGridPartSize);
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
			expect(relativeCoordinateToReal(0)).to.equal(1 * EnvSetup.halfGridPartSize);
			expect(relativeCoordinateToReal(1)).to.equal(3 * EnvSetup.halfGridPartSize);
			expect(relativeCoordinateToReal(2)).to.equal(5 * EnvSetup.halfGridPartSize);
			expect(relativeCoordinateToReal(3)).to.equal(7 * EnvSetup.halfGridPartSize);
		});
	});

	describe("realCoordinateToRelative", function() {
		it("", function() {
			expect(realCoordinateToRelative(1 * EnvSetup.halfGridPartSize)).to.equal(0);
			expect(realCoordinateToRelative(3 * EnvSetup.halfGridPartSize)).to.equal(1);
			expect(realCoordinateToRelative(5 * EnvSetup.halfGridPartSize)).to.equal(2);
			expect(realCoordinateToRelative(7 * EnvSetup.halfGridPartSize)).to.equal(3);
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
			expect(relativePositionToPoint(0, 0)).to.deep.equal({ x: 1 * EnvSetup.halfGridPartSize, y: 1 * EnvSetup.halfGridPartSize });
			expect(relativePositionToPoint(1, 1)).to.deep.equal({ x: 3 * EnvSetup.halfGridPartSize, y: 3 * EnvSetup.halfGridPartSize });
			expect(relativePositionToPoint(2, 2)).to.deep.equal({ x: 5 * EnvSetup.halfGridPartSize, y: 5 * EnvSetup.halfGridPartSize });
			expect(relativePositionToPoint(3, 3)).to.deep.equal({ x: 7 * EnvSetup.halfGridPartSize, y: 7 * EnvSetup.halfGridPartSize });
		});
	});
});
