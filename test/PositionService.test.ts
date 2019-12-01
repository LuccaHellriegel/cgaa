import { expect } from "chai";
import {
  wallPartHalfSize
} from "../src/global";
import { PositionService } from "../src/services/PositionService";

describe("Test PositionService", function() {
  describe("Find relativ position in Area", function() {
    it("Should be in the middle of the 3x3 area", function() {
      let x = 0 + 3 * wallPartHalfSize;
      let y = 0 + 3 * wallPartHalfSize;
      let walkableArr = [[0,0,0],[0,0,0],[0,0,0]];
      let { row, column } = PositionService.findCurRelativePosition(
        walkableArr,
        x,
        y
      );
      expect(row).to.equal(1);
      expect(column).to.equal(1);
    });
    it("Should be in middle left of the 3x3 area", function() {
      let y = 0 + 3 * wallPartHalfSize;
      let walkableArr = [[0,0,0],[0,0,0],[0,0,0]];
      let { row, column } = PositionService.findCurRelativePosition(
        walkableArr,
        wallPartHalfSize,
        y
      );
      expect(row).to.equal(1);
      expect(column).to.equal(0);
    });
    it("Should be in the middle of the 5x5 area", function() {
      let x = 0 + 5 * wallPartHalfSize;

      let y = 0 + 5 * wallPartHalfSize;
      let walkableArr = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
      let { row, column } = PositionService.findCurRelativePosition(
        walkableArr,
        x,
        y
      );
      expect(row).to.equal(2);
      expect(column).to.equal(2);
    });
    it("Should be in the middle of the 5x5 area even if the starting position is not accurate", function() {
      let x = 0 + 5 * wallPartHalfSize;
      let y = 0 + 5 * wallPartHalfSize;
      let walkableArr = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
      let { row, column } = PositionService.findCurRelativePosition(
        walkableArr,
        x -7,
        y -7
      );
      expect(row).to.equal(2);
      expect(column).to.equal(2);
    });
    it("X and Y should be snapped back to 200", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        5 * wallPartHalfSize - 7,
        5 * wallPartHalfSize - 7
      );

      expect(newX).to.equal(5 * wallPartHalfSize);
      expect(newY).to.equal(5 * wallPartHalfSize);
    });
    it("X and Y should remain 200", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        5 * wallPartHalfSize,
        5 * wallPartHalfSize
      );

      expect(newX).to.equal(5 * wallPartHalfSize);
      expect(newY).to.equal(5 * wallPartHalfSize);
    });
    it("If X and Y is between tiles it should go to the closest (the right one)", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        2 * wallPartHalfSize + 2,
        wallPartHalfSize
      );

      expect(newX).to.equal(3 * wallPartHalfSize);
      expect(newY).to.equal(wallPartHalfSize);
    });
    it("If X and Y is between tiles it should go to the closest (the left one)", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        2 * wallPartHalfSize - 2,
        wallPartHalfSize
      );

      expect(newX).to.equal(wallPartHalfSize);
      expect(newY).to.equal(wallPartHalfSize);
    });
  });

  describe("Find clostest area", function() {
    it("One area available means it is closest", function() {
      let areas = [{x: 0, y:0}]
      let closestArea = PositionService.findClosestArea(areas,0,0)
      expect(closestArea).to.equal(areas[0]);

    })})
    it("The area with dist 1 is closest", function() {
      let areas = [{x: 1, y:0}, {x: 2, y:0}]
      let closestArea = PositionService.findClosestArea(areas,0,0)
      expect(closestArea).to.equal(areas[0]);

    })

});
