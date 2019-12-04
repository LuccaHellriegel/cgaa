import { expect } from "chai";
import { wallPartHalfSize } from "../../src/globals/globalSizes";
import { PositionService } from "../../src/services/PositionService";

describe("Test PositionService", function() {
  describe("Find relativ position in Area", function() {
    it("Should be in the middle of the 3x3 area", function() {
      let x = 0 + 3 * wallPartHalfSize;
      let y = 0 + 3 * wallPartHalfSize;
      let walkableArr = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      let { row, column } = PositionService.findCurRelativePosition(walkableArr, x, y);
      expect(row).to.equal(1);
      expect(column).to.equal(1);
    });
    it("Should be in middle left of the 3x3 area", function() {
      let y = 0 + 3 * wallPartHalfSize;
      let walkableArr = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      let { row, column } = PositionService.findCurRelativePosition(walkableArr, wallPartHalfSize, y);
      expect(row).to.equal(1);
      expect(column).to.equal(0);
    });
    it("Should be in the middle of the 5x5 area", function() {
      let x = 0 + 5 * wallPartHalfSize;

      let y = 0 + 5 * wallPartHalfSize;
      let walkableArr = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      let { row, column } = PositionService.findCurRelativePosition(walkableArr, x, y);
      expect(row).to.equal(2);
      expect(column).to.equal(2);
    });
    it("Should be in the middle of the 5x5 area even if the starting position is not accurate", function() {
      let x = 0 + 5 * wallPartHalfSize;
      let y = 0 + 5 * wallPartHalfSize;
      let walkableArr = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      let { row, column } = PositionService.findCurRelativePosition(walkableArr, x - 7, y - 7);
      expect(row).to.equal(2);
      expect(column).to.equal(2);
    });
    it("X and Y should be snapped back to 200", function() {
      let { newX, newY } = PositionService.snapXYToGrid(5 * wallPartHalfSize - 7, 5 * wallPartHalfSize - 7);

      expect(newX).to.equal(5 * wallPartHalfSize);
      expect(newY).to.equal(5 * wallPartHalfSize);
    });
    it("X and Y should remain 200", function() {
      let { newX, newY } = PositionService.snapXYToGrid(5 * wallPartHalfSize, 5 * wallPartHalfSize);

      expect(newX).to.equal(5 * wallPartHalfSize);
      expect(newY).to.equal(5 * wallPartHalfSize);
    });
    it("If X and Y is between tiles it should go to the closest (the right one)", function() {
      let { newX, newY } = PositionService.snapXYToGrid(2 * wallPartHalfSize + 2, wallPartHalfSize);

      expect(newX).to.equal(3 * wallPartHalfSize);
      expect(newY).to.equal(wallPartHalfSize);
    });
    it("If X and Y is between tiles it should go to the closest (the left one)", function() {
      let { newX, newY } = PositionService.snapXYToGrid(2 * wallPartHalfSize - 2, wallPartHalfSize);

      expect(newX).to.equal(wallPartHalfSize);
      expect(newY).to.equal(wallPartHalfSize);
    });
  });
  describe("Convert relative pos in Area to real pos", function() {
    it("First position is first in grid (wallPartHalfSize,wallPartHalfSize)", function() {
      let area = { topLeftX: 0, topLeftY: 0 };
      let realPos = PositionService.relativePosToRealPosInArea(area, 0, 0);
      expect(realPos).to.deep.equal({ x: wallPartHalfSize, y: wallPartHalfSize });
    });
    it("First position is first in moved grid (wallPartHalfSize+100,wallPartHalfSize)", function() {
      let area = { topLeftX: 0 + 100, topLeftY: 0 };
      let realPos = PositionService.relativePosToRealPosInArea(area, 0, 0);
      expect(realPos).to.deep.equal({ x: wallPartHalfSize + 100, y: wallPartHalfSize });
    });
    it("Second position is second in grid (3*wallPartHalfSize,wallPartHalfSize)", function() {
      let area = { topLeftX: 0, topLeftY: 0 };
      let realPos = PositionService.relativePosToRealPosInArea(area, 1, 0);
      expect(realPos).to.deep.equal({ x: 3 * wallPartHalfSize, y: wallPartHalfSize });
    });
    it("(1,1) position is (1,1) in grid (3*wallPartHalfSize,3*wallPartHalfSize)", function() {
      let area = { topLeftX: 0, topLeftY: 0 };
      let realPos = PositionService.relativePosToRealPosInArea(area, 1, 1);
      expect(realPos).to.deep.equal({ x: 3 * wallPartHalfSize, y: 3 * wallPartHalfSize });
    });
  });

  describe("Convert relative pos in Area to real pos and back", function() {
    it("First position is first in grid (0,0)", function() {
      let area = { topLeftX: 0, topLeftY: 0 };
      let realPos = PositionService.relativePosToRealPosInArea(area, 0, 0);
      let relativePos = PositionService.realPosToRelativePosInEnv(realPos.x, realPos.y);
      expect(relativePos).to.deep.equal({ column: 0, row: 0 });
    });
    it("Second position is second in grid (1,0)", function() {
      let area = { topLeftX: 0, topLeftY: 0 };
      let realPos = PositionService.relativePosToRealPosInArea(area, 1, 0);
      let relativePos = PositionService.realPosToRelativePosInEnv(realPos.x, realPos.y);
      expect(relativePos).to.deep.equal({ column: 1, row: 0 });
    });
    it("Position (51,23) stays there", function() {
      let area = { topLeftX: 0, topLeftY: 0 };
      let realPos = PositionService.relativePosToRealPosInArea(area, 51, 23);
      let relativePos = PositionService.realPosToRelativePosInEnv(realPos.x, realPos.y);
      expect(relativePos).to.deep.equal({ column: 51, row: 23 });
    });
  });
});
