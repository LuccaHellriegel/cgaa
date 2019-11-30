import { expect } from "chai";
import { AreaService } from "../js/env/areas/AreaService";
import { AreaPart } from "../js/env/areas/AreaPart";

describe("Test AreaService", function() {
  describe("Calculate walkable map", function() {
    it("Empty single part map, everything is walkable", () => {
      let parts: AreaPart[][] = [[new AreaPart(null)]];

      let walkAbleArr = [[0]];
      AreaService.updateWalkableArr(1, 1, parts, walkAbleArr);
      let expectedWalkableArr = [[0]];
      expect(walkAbleArr).to.deep.equal(expectedWalkableArr);
    });
    it("Empty 3x3 part map, everything is walkable", () => {
      let parts: AreaPart[][] = [
        [new AreaPart(null), new AreaPart(null), new AreaPart(null)],
        [new AreaPart(null), new AreaPart(null), new AreaPart(null)],
        [new AreaPart(null), new AreaPart(null), new AreaPart(null)]
      ];
      let walkAbleArr = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];

      AreaService.updateWalkableArr(3, 3, parts, walkAbleArr);
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
      let walkAbleArr = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];

      AreaService.updateWalkableArr(3, 3, parts, walkAbleArr);
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
      let walkAbleArr = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];

      AreaService.updateWalkableArr(5, 5, parts, walkAbleArr);
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
