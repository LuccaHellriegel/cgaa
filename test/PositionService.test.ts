import { expect } from "chai";
import {
  wallPartRadius,
  rectBuildingHalfWidth,
  rectBuildinghalfHeight
} from "../js/global";
import { PositionService } from "../js/services/PositionService";

describe("Test PositionService", function() {
  describe("Find relativ position in WallArea", function() {
    it("Should be in the middle of the 3x3 area", function() {
      let x = 0 + 3 * wallPartRadius;
      let y = 0 + 3 * wallPartRadius;
      let wallArea = { x: x, y: y, sizeOfXAxis: 3, sizeOfYAxis: 3 };
      let { row, column } = PositionService.findCurRelativePosInWallArea(
        wallArea,
        x,
        y
      );
      expect(row).to.equal(1);
      expect(column).to.equal(1);
    });
    it("Should be in middle left of the 3x3 area", function() {
      let x = 0 + 3 * wallPartRadius;
      let y = 0 + 3 * wallPartRadius;
      let wallArea = { x: x, y: y, sizeOfXAxis: 3, sizeOfYAxis: 3 };
      let { row, column } = PositionService.findCurRelativePosInWallArea(
        wallArea,
        wallPartRadius,
        y
      );
      expect(row).to.equal(1);
      expect(column).to.equal(0);
    });
    it("Should be in the middle of the 5x5 area", function() {
      let x = 0 + 5 * wallPartRadius;
      let y = 0 + 5 * wallPartRadius;
      let wallArea = { x: x, y: y, sizeOfXAxis: 5, sizeOfYAxis: 5 };
      let { row, column } = PositionService.findCurRelativePosInWallArea(
        wallArea,
        x,
        y
      );
      expect(row).to.equal(2);
      expect(column).to.equal(2);
    });
    it("Should be in the middle of the 5x5 area even it the starting position is not accurate", function() {
      let x = 0 + 5 * wallPartRadius;
      let y = 0 + 5 * wallPartRadius;
      let wallArea = { x: x, y: y, sizeOfXAxis: 5, sizeOfYAxis: 5 };
      let { row, column } = PositionService.findCurRelativePosInWallArea(
        wallArea,
        x - 7,
        y - 7
      );
      expect(row).to.equal(2);
      expect(column).to.equal(2);
    });
    it("X and Y should be snapped back to 200", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        5 * wallPartRadius - 7,
        5 * wallPartRadius - 7
      );

      expect(newX).to.equal(5 * wallPartRadius);
      expect(newY).to.equal(5 * wallPartRadius);
    });
    it("X and Y should remain 200", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        5 * wallPartRadius,
        5 * wallPartRadius
      );

      expect(newX).to.equal(5 * wallPartRadius);
      expect(newY).to.equal(5 * wallPartRadius);
    });
    it("If X and Y is between tiles it should go to the closest (the right one)", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        2 * wallPartRadius + 2,
        wallPartRadius
      );

      expect(newX).to.equal(3 * wallPartRadius);
      expect(newY).to.equal(wallPartRadius);
    });
    it("If X and Y is between tiles it should go to the closest (the left one)", function() {
      let { newX, newY } = PositionService.snapXYToGrid(
        2 * wallPartRadius - 2,
        wallPartRadius
      );

      expect(newX).to.equal(wallPartRadius);
      expect(newY).to.equal(wallPartRadius);
    });
  });

});
