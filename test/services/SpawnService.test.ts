import { expect } from "chai";
import { wallPartHalfSize, rectBuildingHalfWidth, rectBuildinghalfHeight } from "../../src/globals/globalSizes";
import { SpawnService } from "../../src/spawn/SpawnService";
import { AreaPosition } from "../../src/env/areas/AreaPosition";

describe("Test SpawnService", function() {
  describe("Calculate valid spawn positions", function() {
    it("There are only 12 valid positions around a building", () => {
      let buildingX = 0 + 2 * wallPartHalfSize + rectBuildingHalfWidth;
      let buildingY = 0 + 2 * wallPartHalfSize + rectBuildinghalfHeight;
      let validPositions = SpawnService.calculateSpawnPositionsAroundBuilding(buildingX, buildingY);

      let rowAboveY = wallPartHalfSize;
      let rowBelowY = 5 * wallPartHalfSize;

      let realPositions = [
        { randX: 0 + wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 3 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 5 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 7 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 9 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 3 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 5 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 7 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 9 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + wallPartHalfSize, randY: 3 * wallPartHalfSize },
        { randX: 0 + 3 * wallPartHalfSize + 2 * rectBuildingHalfWidth, randY: 3 * wallPartHalfSize }
      ];
      expect(validPositions.length).to.equal(12);
      expect(validPositions).to.deep.equal(realPositions);
    });

    it("There are only 14 valid positions around a double building ", () => {
      let buildingX = 0 + 5 * wallPartHalfSize;
      let buildingY = 0 + 4 * wallPartHalfSize;
      let validPositions = SpawnService.calculateSpawnPositionsAround(
        buildingX,
        buildingY,
        2 * rectBuildingHalfWidth,
        4 * rectBuildinghalfHeight
      );

      let rowAboveY = wallPartHalfSize;
      let rowBelowY = 7 * wallPartHalfSize;

      let realPositions = [
        { randX: 0 + wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 3 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 5 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 7 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 9 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 3 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 5 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 7 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 9 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + wallPartHalfSize, randY: 3 * wallPartHalfSize },
        { randX: 0 + wallPartHalfSize, randY: 5 * wallPartHalfSize },
        { randX: 0 + 3 * wallPartHalfSize + 2 * rectBuildingHalfWidth, randY: 3 * wallPartHalfSize },
        { randX: 0 + 3 * wallPartHalfSize + 2 * rectBuildingHalfWidth, randY: 5 * wallPartHalfSize }
      ];
      expect(validPositions.length).to.equal(14);
      expect(validPositions).to.deep.equal(realPositions);
    });

    it("There are only 8 valid positions around a circle ", () => {
      let x = 0 + 3 * wallPartHalfSize;
      let y = 0 + 3 * wallPartHalfSize;
      let validPositions = SpawnService.calculateSpawnPositionsAroundCircle(x, y);

      let rowAboveY = wallPartHalfSize;
      let rowBelowY = 5 * wallPartHalfSize;

      let realPositions = [
        { randX: 0 + wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 3 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + 5 * wallPartHalfSize, randY: rowAboveY },
        { randX: 0 + wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 3 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + 5 * wallPartHalfSize, randY: rowBelowY },
        { randX: 0 + wallPartHalfSize, randY: 3 * wallPartHalfSize },
        { randX: 0 + 5 * wallPartHalfSize, randY: 3 * wallPartHalfSize }
      ];
      expect(validPositions.length).to.equal(8);
      expect(validPositions).to.deep.equal(realPositions);
    });
  });
  describe("Update walkable arr to building spawnable arr", function() {
    it("In the 4x4 walled area are there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let realSpawnableArr = [
        [1, 1, 1, 1],
        [1, 3, 3, 1],
        [1, 3, 3, 1],
        [1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });
    it("In the 4x5 walled area are there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let realSpawnableArr = [
        [1, 1, 1, 1, 1],
        [1, 3, 3, 3, 1],
        [1, 3, 3, 3, 1],
        [1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });
    it("In the 5x6 walled area are there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let realSpawnableArr = [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 1],
        [1, 3, 3, 3, 3, 1],
        [1, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });
    it("In the 6x6 walled area there is one spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let realSpawnableArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });
    it("In the 6x7 walled area there are two spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let realSpawnableArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });
    it("In the 6x7 walled area with a building there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 2, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      //building for loop replaces parts of wall
      let realSpawnableArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });

    it("In the 7x7 walled area with a building there are is one spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 2, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      //building for loop replaces parts of wall
      let realSpawnableArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });
  });

  describe("Extract spawnable pos in arr", function() {
    it("In the 6x7 walled area are there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 2, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let spawnablePos = SpawnService.extractSpawnPosFromSpawnableArr(partialArr);
      expect(spawnablePos).to.deep.equal([]);
    });
    it("In the 7x7 walled area there are three spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let realSpawnableArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];

      let spawnablePos = SpawnService.extractSpawnPosFromSpawnableArr(partialArr);
      expect(spawnablePos.length).to.equal(3);
      expect(spawnablePos).to.deep.equal([
        { row: 2, column: 3 },
        { row: 3, column: 3 },
        { row: 4, column: 3 }
      ]);
      expect(partialArr).to.deep.equal(realSpawnableArr);
    });
    it("In the 7x7 walled area with building are there is one spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 2, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableArr(partialArr);
      let spawnablePos = SpawnService.extractSpawnPosFromSpawnableArr(partialArr);
      expect(spawnablePos).to.deep.equal([{ row: 4, column: 3 }]);
    });
  });
  describe("Calculate walkable map", function() {
    it("Empty single part map, everything is walkable", () => {
      let parts: AreaPosition[][] = [[new AreaPosition(null)]];

      let walkAbleArr = SpawnService.createWalkableArr(parts);

      let expectedWalkableArr = [[0]];
      expect(walkAbleArr).to.deep.equal(expectedWalkableArr);
    });
    it("Empty 3x3 part map, everything is walkable", () => {
      let parts: AreaPosition[][] = [
        [new AreaPosition(null), new AreaPosition(null), new AreaPosition(null)],
        [new AreaPosition(null), new AreaPosition(null), new AreaPosition(null)],
        [new AreaPosition(null), new AreaPosition(null), new AreaPosition(null)]
      ];
      let walkAbleArr = SpawnService.createWalkableArr(parts);

      let expectedWalkableArr = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      expect(walkAbleArr).to.deep.equal(expectedWalkableArr);
    });
    it("3x3 part map with border wall, only the middle is walkable", () => {
      let parts: AreaPosition[][] = [
        [new AreaPosition({}), new AreaPosition({}), new AreaPosition({})],
        [new AreaPosition({}), new AreaPosition(null), new AreaPosition({})],
        [new AreaPosition({}), new AreaPosition({}), new AreaPosition({})]
      ];
      let walkAbleArr = SpawnService.createWalkableArr(parts);

      let expectedWalkableArr = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ];
      expect(walkAbleArr).to.deep.equal(expectedWalkableArr);
    });
    it("5x5 part map with border wall and building, only the empty spots are walkable", () => {
      let parts: AreaPosition[][] = [
        [new AreaPosition({}), new AreaPosition({}), new AreaPosition({}), new AreaPosition({}), new AreaPosition({})],
        [
          new AreaPosition({}),
          new AreaPosition(null),
          new AreaPosition(null),
          new AreaPosition(null),
          new AreaPosition({})
        ],
        [
          new AreaPosition({}),
          new AreaPosition(null),
          new AreaPosition({}),
          new AreaPosition({}),
          new AreaPosition({})
        ],
        [
          new AreaPosition({}),
          new AreaPosition(null),
          new AreaPosition(null),
          new AreaPosition(null),
          new AreaPosition({})
        ],
        [new AreaPosition({}), new AreaPosition({}), new AreaPosition({}), new AreaPosition({}), new AreaPosition({})]
      ];
      let walkAbleArr = SpawnService.createWalkableArr(parts);

      let expectedWalkableArr = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];
      expect(walkAbleArr).to.deep.equal(expectedWalkableArr);
    });
  });
});
