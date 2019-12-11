import { expect } from "chai";
import { SpawnService } from "../../src/enemies/spawn/SpawnService";

describe("Test SpawnService", function() {
  describe("Update walkable arr to building spawnable arr", function() {
    it("In the 4x4 walled area are there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let realSpawnableMap = [
        [1, 1, 1, 1],
        [1, 3, 3, 1],
        [1, 3, 3, 1],
        [1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableMap);
    });
    it("In the 4x5 walled area are there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let realSpawnableMap = [
        [1, 1, 1, 1, 1],
        [1, 3, 3, 3, 1],
        [1, 3, 3, 3, 1],
        [1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableMap);
    });
    it("In the 5x6 walled area are there are no spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let realSpawnableMap = [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 1],
        [1, 3, 3, 3, 3, 1],
        [1, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableMap);
    });
    it("In the 6x6 walled area there is one spawnable pos", () => {
      let partialArr = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let realSpawnableMap = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableMap);
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
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let realSpawnableMap = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableMap);
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
      SpawnService.updateBuildingSpawnableMap(partialArr);
      //building for loop replaces parts of wall
      let realSpawnableMap = [
        [1, 1, 1, 1, 1, 1, 1],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableMap);
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
      SpawnService.updateBuildingSpawnableMap(partialArr);
      //building for loop replaces parts of wall
      let realSpawnableMap = [
        [1, 1, 1, 1, 1, 1, 1],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      expect(partialArr).to.deep.equal(realSpawnableMap);
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
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let spawnablePos = SpawnService.extractSpawnPosFromSpawnableMap(partialArr);
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
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let realSpawnableMap = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 0, 3, 3, 1],
        [1, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];

      let spawnablePos = SpawnService.extractSpawnPosFromSpawnableMap(partialArr);
      expect(spawnablePos.length).to.equal(3);
      expect(spawnablePos).to.deep.equal([
        { row: 2, column: 3 },
        { row: 3, column: 3 },
        { row: 4, column: 3 }
      ]);
      expect(partialArr).to.deep.equal(realSpawnableMap);
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
      SpawnService.updateBuildingSpawnableMap(partialArr);
      let spawnablePos = SpawnService.extractSpawnPosFromSpawnableMap(partialArr);
      expect(spawnablePos).to.deep.equal([{ row: 4, column: 3 }]);
    });
  });

  describe("Extract area relative spawn pos", function() {
    it("1x1 area has no spawnable pos", () => {
      let SpawnableMap = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];

      expect(SpawnService.extractSpawnPosFromSpawnableMapForArea(0, 0, 1, 1, SpawnableMap)).to.deep.equal([]);
    });
    it("2x2 area has one spawnable pos", () => {
      let SpawnableMap = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];

      expect(SpawnService.extractSpawnPosFromSpawnableMapForArea(0, 0, 2, 2, SpawnableMap)).to.deep.equal([
        { column: 1, row: 1 }
      ]);
    });
    it("4x4 area has 7 spawnable pos", () => {
      let SpawnableMap = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];

      expect(SpawnService.extractSpawnPosFromSpawnableMapForArea(0, 0, 4, 4, SpawnableMap)).to.deep.equal([
        { column: 1, row: 1 },
        { column: 2, row: 1 },
        { column: 3, row: 1 },
        { column: 1, row: 2 },
        { column: 1, row: 3 },
        { column: 2, row: 3 },
        { column: 3, row: 3 }
      ]);
    });
    it("2x5 area has 3 spawnable pos", () => {
      let SpawnableMap = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];

      expect(SpawnService.extractSpawnPosFromSpawnableMapForArea(1, 0, 5, 2, SpawnableMap)).to.deep.equal([
        { column: 1, row: 1 },
        { column: 2, row: 1 },
        { column: 3, row: 1 }
      ]);
    });
    it("2x4 area starting bad has 3 spawnable pos", () => {
      let SpawnableMap = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];

      expect(SpawnService.extractSpawnPosFromSpawnableMapForArea(1, 0, 4, 2, SpawnableMap)).to.deep.equal([
        { column: 1, row: 1 },
        { column: 2, row: 1 },
        { column: 3, row: 1 }
      ]);
    });
    it("3x2 area has 3 spawnable pos", () => {
      let SpawnableMap = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ];

      expect(SpawnService.extractSpawnPosFromSpawnableMapForArea(1, 0, 2, 3, SpawnableMap)).to.deep.equal([
        { column: 1, row: 1 },
        { column: 2, row: 1 },
        { column: 1, row: 2 }
      ]);
    });
  });

  describe("Try all pos", function() {
    it("Last pos is returned", () => {
      let spawnablePos = [
        { column: 0, row: 0 },
        { column: 1, row: 0 },
        { column: 2, row: 0 },
        { column: 3, row: 0 }
      ];
      let randGenerationCallback = () => 0;
      let validTestingCallback = (column, row) => {
        return column === 3 && row === 0;
      };
      let pos = SpawnService.randomlyTryAllSpawnablePos(spawnablePos, randGenerationCallback, validTestingCallback);
      expect(pos).to.deep.equal({ column: 3, row: 0 });
    });
  });
  describe("Calculate relative spawn pos around", function() {
    it("Spawn pos around (1,1) form a circle around it", () => {
      let positions = SpawnService.calculateRelativeSpawnPositionsAround(1, 1, 1, 1);
      let expectedPositions = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
        { row: 1, column: 0 },
        { row: 1, column: 2 }
      ];

      expectedPositions.forEach(pos => expect(positions).to.deep.include(pos));
    });
    it("Spawn pos around building shape are 12", () => {
      let positions = SpawnService.calculateRelativeSpawnPositionsAround(2, 1, 3, 1);
      let expectedPositions = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 0, column: 3 },
        { row: 0, column: 4 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
        { row: 2, column: 3 },
        { row: 2, column: 4 },
        { row: 1, column: 0 },
        { row: 1, column: 4 }
      ];

      expectedPositions.forEach(pos => expect(positions).to.deep.include(pos));
    });
    it("Spawn pos around 5 part building shape are 16", () => {
      let positions = SpawnService.calculateRelativeSpawnPositionsAround(3, 1, 5, 1);
      let expectedPositions = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 0, column: 3 },
        { row: 0, column: 4 },
        { row: 0, column: 5 },
        { row: 0, column: 6 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
        { row: 2, column: 3 },
        { row: 2, column: 4 },
        { row: 2, column: 5 },
        { row: 2, column: 6 },
        { row: 1, column: 0 },
        { row: 1, column: 6 }
      ];

      expectedPositions.forEach(pos => expect(positions).to.deep.include(pos));
    });
  });
});
