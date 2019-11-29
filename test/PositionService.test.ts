import { expect } from "chai";
import {
  wallPartRadius,
  rectBuildingHalfWidth,
  rectBuildinghalfHeight
} from "../js/global";
import { PositionService } from "../js/services/PositionService";

describe("Test PositionService", function() {
  describe("Calculate valid spawn positions around building", function() {
    it("There are only 12 valid positions", () => {
      let buildingX = 0 + 2 * wallPartRadius + rectBuildingHalfWidth;
      let buildingY = 0 + 2 * wallPartRadius + rectBuildinghalfHeight;
      let validPositions = PositionService.calculateValidSpawnPositions(
        buildingX,
        buildingY
      );
      let realValidPositions = [
        { randX: 0 + wallPartRadius, randY: 0 + wallPartRadius },
        { randX: 0 + 3 * wallPartRadius, randY: 0 + wallPartRadius },
        { randX: 0 + wallPartRadius, randY: 0 + 3 * wallPartRadius },
        {
          randX: 0 + wallPartRadius + 4 * 2 * wallPartRadius,
          randY: 0 + 3 * wallPartRadius
        },
        {
          randX: 0 + wallPartRadius,
          randY: 0 + wallPartRadius + 2 * 2 * wallPartRadius
        },
        {
          randX: 0 + 3 * wallPartRadius,
          randY: 0 + wallPartRadius + 2 * 2 * wallPartRadius
        }
      ];

      expect(validPositions.length).to.equal(12);
      expect(validPositions[0]).to.deep.equal(realValidPositions[0]);
      expect(validPositions[1]).to.deep.equal(realValidPositions[1]);
      expect(validPositions[10]).to.deep.equal(realValidPositions[2]);
      expect(validPositions[11]).to.deep.equal(realValidPositions[3]);
      expect(validPositions[5]).to.deep.equal(realValidPositions[4]);
      expect(validPositions[6]).to.deep.equal(realValidPositions[5]);
    });
  });

  describe("Find relativ position in WallArea", function() {
    it("Should be in the middle of the 3x3 area", function() {
      let x = 0 + 3 * wallPartRadius;
      let y = 0 + 3 * wallPartRadius;
      let wallArea = { x: x, y: y, numberOfXRects: 3, numberOfYRects: 1 };
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
      let wallArea = { x: x, y: y, numberOfXRects: 3, numberOfYRects: 1 };
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
      let wallArea = { x: x, y: y, numberOfXRects: 5, numberOfYRects: 3 };
      let { row, column } = PositionService.findCurRelativePosInWallArea(
        wallArea,
        x,
        y
      );
      expect(row).to.equal(2);
      expect(column).to.equal(2);
    });
  });
});
