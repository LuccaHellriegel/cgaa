import { expect } from "chai";
import {
  wallPartHalfSize,
  rectBuildingHalfWidth,
  rectBuildinghalfHeight
} from "../src/globals/globalSizes";
import { BuildingService } from "../src/env/buildings/BuildingService";

describe("Test BuildingService", function() {
  describe("Calculate valid spawn positions around building", function() {
    it("There are only 12 valid positions", () => {
      let buildingX = 0 + 2 * wallPartHalfSize + rectBuildingHalfWidth;
      let buildingY = 0 + 2 * wallPartHalfSize + rectBuildinghalfHeight;
      let validPositions = BuildingService.calculateValidSpawnPositionsAroundBuilding(
        buildingX,
        buildingY
      );
      let realValidPositions = [
        { randX: 0 + wallPartHalfSize, randY: 0 + wallPartHalfSize },
        { randX: 0 + 3 * wallPartHalfSize, randY: 0 + wallPartHalfSize },
        { randX: 0 + wallPartHalfSize, randY: 0 + 3 * wallPartHalfSize },
        {
          randX: 0 + wallPartHalfSize + 4 * 2 * wallPartHalfSize,
          randY: 0 + 3 * wallPartHalfSize
        },
        {
          randX: 0 + wallPartHalfSize,
          randY: 0 + wallPartHalfSize + 2 * 2 * wallPartHalfSize
        },
        {
          randX: 0 + 3 * wallPartHalfSize,
          randY: 0 + wallPartHalfSize + 2 * 2 * wallPartHalfSize
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

  describe("Check if new building is on top of old ones or their spawn areas", function() {
    it("New building is in the same place as old one, so yes ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = rectBuildingHalfWidth;
      let randY = rectBuildinghalfHeight;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.true;
    });
    it("New building is in the same place as second one, so yes ", function() {
      let buildings = [
        { x: 4 * rectBuildingHalfWidth, y: 4 * rectBuildinghalfHeight },
        { x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }
      ];
      let randX = rectBuildingHalfWidth;
      let randY = rectBuildinghalfHeight;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.true;
    });
    it("New building is overlapping on the right, so yes ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = 2 * rectBuildingHalfWidth;
      let randY = rectBuildinghalfHeight;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.true;
    });
    it("New building is overlapping spawn area on the right, so yes ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = 3 * rectBuildingHalfWidth + wallPartHalfSize;
      let randY = rectBuildinghalfHeight;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.true;
    });
    it("New building is overlapping on the bottom, so yes ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = rectBuildingHalfWidth;
      let randY = 2 * rectBuildinghalfHeight;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.true;
    });
    it("New building is overlapping spawn area on the bottom, so yes ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = rectBuildingHalfWidth;
      let randY = 3 * rectBuildinghalfHeight + wallPartHalfSize;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.true;
    });
    it("New building is exactly far enough away to the right, so no ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = 3 * rectBuildingHalfWidth + 2 * wallPartHalfSize;
      let randY = rectBuildinghalfHeight;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.false;
    });
    it("New building is more than far enough away to the right, so no ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = 3 * rectBuildingHalfWidth + 4 * wallPartHalfSize;
      let randY = rectBuildinghalfHeight;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );
      expect(isOnTop).to.be.false;
    });
    it("New building is exactly far enough away to the bottom, so no ", function() {
      let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
      let randX = rectBuildingHalfWidth;
      let randY = 3 * rectBuildinghalfHeight + 2 * wallPartHalfSize;
      let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        buildings,
        randX,
        randY
      );

      expect(isOnTop).to.be.false;
    });
  });
});
