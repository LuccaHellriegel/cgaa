import { AreaService } from "../../src/world/areas/AreaService";
import { expect } from "chai";
import { AreaPosition } from "../../src/world/areas/AreaPosition";

describe("Test AreaService", function() {
  describe("Calculate walkable map", function() {
    it("Empty single part map, everything is walkable", () => {
      let parts: AreaPosition[][] = [[new AreaPosition(null)]];

      let walkAbleArr = AreaService.createWalkableArr(parts);

      let expectedWalkableArr = [[0]];
      expect(walkAbleArr).to.deep.equal(expectedWalkableArr);
    });
    it("Empty 3x3 part map, everything is walkable", () => {
      let parts: AreaPosition[][] = [
        [new AreaPosition(null), new AreaPosition(null), new AreaPosition(null)],
        [new AreaPosition(null), new AreaPosition(null), new AreaPosition(null)],
        [new AreaPosition(null), new AreaPosition(null), new AreaPosition(null)]
      ];
      let walkAbleArr = AreaService.createWalkableArr(parts);

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
      let walkAbleArr = AreaService.createWalkableArr(parts);

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
      let walkAbleArr = AreaService.createWalkableArr(parts);

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
