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
    it("Should be in the middle of the 5x5 area even it the starting position is not accurate", function() {
      let x = 0 + 5 * wallPartRadius;
      let y = 0 + 5 * wallPartRadius;
      let wallArea = { x: x, y: y, numberOfXRects: 5, numberOfYRects: 3 };
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
  describe("Check if new building is on top of old ones or their spawn areas", function() {
    it("New building is in the same place as old one, so yes ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = rectBuildingHalfWidth
      let randY = rectBuildinghalfHeight
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.true
    });
    it("New building is in the same place as second one, so yes ", function() {
      let buildings = [{x: 4* rectBuildingHalfWidth, y: 4* rectBuildinghalfHeight}, {x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = rectBuildingHalfWidth
      let randY = rectBuildinghalfHeight
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.true
    });
    it("New building is overlapping on the right, so yes ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = 2* rectBuildingHalfWidth
      let randY = rectBuildinghalfHeight
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.true
    });
    it("New building is overlapping spawn area on the right, so yes ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = 3* rectBuildingHalfWidth + wallPartRadius
      let randY = rectBuildinghalfHeight
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.true
    });
    it("New building is overlapping on the bottom, so yes ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = rectBuildingHalfWidth
      let randY = 2*rectBuildinghalfHeight
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.true
    });
    it("New building is overlapping spawn area on the bottom, so yes ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = rectBuildingHalfWidth
      let randY = 3*rectBuildinghalfHeight + wallPartRadius
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.true
    });
    it("New building is exactly far enough away to the right, so no ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = 3*rectBuildingHalfWidth + 2*wallPartRadius
      let randY = rectBuildinghalfHeight
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.false
    });
    it("New building is more than far enough away to the right, so no ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = 3*rectBuildingHalfWidth + 4*wallPartRadius
      let randY = rectBuildinghalfHeight
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)
      expect(isOnTop).to.be.false
    });
    it("New building is exactly far enough away to the bottom, so no ", function() {
      let buildings = [{x: rectBuildingHalfWidth, y: rectBuildinghalfHeight}]
      let randX = rectBuildingHalfWidth
      let randY = 3*rectBuildinghalfHeight + 2*wallPartRadius
      let isOnTop = PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY)

      expect(isOnTop).to.be.false
    });
  });
});
