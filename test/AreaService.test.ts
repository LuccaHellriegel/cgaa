import { expect } from "chai";
import { AreaService } from "../js/env/areas/AreaService";
import { AreaPart } from "../js/env/areas/AreaPart";

describe("Test AreaService", function() {
  describe("Calculate walkable map", function() {
    it("Empty single part map, everything is walkable", () => {
      let parts: AreaPart[][] = [[new AreaPart(null)]];

      let walkAbleArr = AreaService.createWalkableArr(parts);

      let expectedWalkableArr = [[0]];
      expect(walkAbleArr).to.deep.equal(expectedWalkableArr);
    });
    it("Empty 3x3 part map, everything is walkable", () => {
      let parts: AreaPart[][] = [
        [new AreaPart(null), new AreaPart(null), new AreaPart(null)],
        [new AreaPart(null), new AreaPart(null), new AreaPart(null)],
        [new AreaPart(null), new AreaPart(null), new AreaPart(null)]
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
      let parts: AreaPart[][] = [
        [new AreaPart({}), new AreaPart({}), new AreaPart({})],
        [new AreaPart({}), new AreaPart(null), new AreaPart({})],
        [new AreaPart({}), new AreaPart({}), new AreaPart({})]
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
      let parts: AreaPart[][] = [
        [
          new AreaPart({}),
          new AreaPart({}),
          new AreaPart({}),
          new AreaPart({}),
          new AreaPart({})
        ],
        [
          new AreaPart({}),
          new AreaPart(null),
          new AreaPart(null),
          new AreaPart(null),
          new AreaPart({})
        ],
        [
          new AreaPart({}),
          new AreaPart(null),
          new AreaPart({}),
          new AreaPart({}),
          new AreaPart({})
        ],
        [
          new AreaPart({}),
          new AreaPart(null),
          new AreaPart(null),
          new AreaPart(null),
          new AreaPart({})
        ],
        [
          new AreaPart({}),
          new AreaPart({}),
          new AreaPart({}),
          new AreaPart({}),
          new AreaPart({})
        ]
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
  describe("Calculate cumulative walkable map", function() {
    it("1x1 areas with single field generate a joined 2x2 map", () => {
      let area51 = [[1]];
      let area52 = [[1]];
      let area53 = [[1]];
      let area54 = [[1]];
      let walkAbleArrArr = [
        [area51, area52],
        [area53, area54]
      ];
      let expectedCumulativeMap = [
        [1, 1],
        [1, 1]
      ];
      let returnedCumulativeMap = AreaService.createCumulativeWalkableArr(
        walkAbleArrArr
      );

      expect(returnedCumulativeMap).to.deep.equal(expectedCumulativeMap);
    });
    it("2 2x2 areas generate a joined 2x2 map", () => {
      let area51 = [
        [1, 1],
        [1, 1]
      ];
      let area52 = [
        [1, 1],
        [1, 1]
      ];
      let walkAbleArrArr = [[area51, area52]];
      let expectedCumulativeMap = [
        [1, 1, 1, 1],
        [1, 1, 1, 1]
      ];
      let returnedCumulativeMap = AreaService.createCumulativeWalkableArr(
        walkAbleArrArr
      );
      expect(returnedCumulativeMap).to.deep.equal(expectedCumulativeMap);
    });
    it("4 2x2 areas generate a joined 4x4 map", () => {
      let area51 = [
        [1, 1],
        [1, 1]
      ];
      let area52 = [
        [1, 1],
        [1, 1]
      ];
      let area53 = [
        [1, 1],
        [1, 1]
      ];
      let area54 = [
        [1, 1],
        [1, 1]
      ];
      let walkAbleArrArr = [
        [area51, area52],
        [area53, area54]
      ];
      let expectedCumulativeMap = [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1]
      ];
      let returnedCumulativeMap = AreaService.createCumulativeWalkableArr(
        walkAbleArrArr
      );
      expect(returnedCumulativeMap).to.deep.equal(expectedCumulativeMap);
    });
    it("4 2x2 areas with 0 in them generate a joined 4x4 map", () => {
      let area51 = [
        [1, 1],
        [1, 0]
      ];
      let area52 = [
        [1, 0],
        [1, 1]
      ];
      let area53 = [
        [1, 1],
        [0, 1]
      ];
      let area54 = [
        [0, 1],
        [1, 1]
      ];
      let walkAbleArrArr = [
        [area51, area52],
        [area53, area54]
      ];
      let expectedCumulativeMap = [
        [1, 1, 1, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [0, 1, 1, 1]
      ];
      let returnedCumulativeMap = AreaService.createCumulativeWalkableArr(
        walkAbleArrArr
      );
      expect(returnedCumulativeMap).to.deep.equal(expectedCumulativeMap);
    });
  });
});
