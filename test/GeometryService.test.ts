import { expect } from "chai";
import { wallPartHalfSize } from "../src/global";
import { GeometryService } from "../src/services/GeometryService";

describe("Test GeometryService", function() {
  describe("Calculate border object", function() {
    it("Calculated border should be equal to manual calculation of 3x3 area", () => {
      let parts = [
        [
          { x: 0 + wallPartHalfSize, y: 0 + wallPartHalfSize },
          { x: 0 + 3 * wallPartHalfSize, y: 0 + wallPartHalfSize },
          { x: 0 + 5 * wallPartHalfSize, y: 0 + wallPartHalfSize }
        ],
        [
          { x: 0 + wallPartHalfSize, y: 0 + 3 * wallPartHalfSize },
          { x: 0 + 3 * wallPartHalfSize, y: 0 + 3 * wallPartHalfSize },
          { x: 0 + 5 * wallPartHalfSize, y: 0 + 3 * wallPartHalfSize }
        ],
        [
          { x: 0 + wallPartHalfSize, y: 0 + 5 * wallPartHalfSize },
          { x: 0 + 3 * wallPartHalfSize, y: 0 + 5 * wallPartHalfSize },
          { x: 0 + 5 * wallPartHalfSize, y: 0 + 5 * wallPartHalfSize }
        ]
      ];
      let borderObject = GeometryService.calculateBorderObjectFromPartsAndSize(
        parts,
        6 * wallPartHalfSize,
        6 * wallPartHalfSize
      );
      expect(borderObject.borderX).to.equal(0 + 2 * wallPartHalfSize);
      expect(borderObject.borderY).to.equal(0 + 2 * wallPartHalfSize);
      expect(borderObject.borderWidth).to.equal(2 * wallPartHalfSize);
      expect(borderObject.borderHeight).to.equal(2 * wallPartHalfSize);
    });

    it("Calculated border should be equal to manual calculation of 4x4 area", () => {
      let parts = [
        [
          { x: 0 + wallPartHalfSize, y: 0 + wallPartHalfSize },
          { x: 0 + 3 * wallPartHalfSize, y: 0 + wallPartHalfSize },
          { x: 0 + 5 * wallPartHalfSize, y: 0 + wallPartHalfSize },
          { x: 0 + 7 * wallPartHalfSize, y: 0 + wallPartHalfSize }
        ],
        [
          { x: 0 + wallPartHalfSize, y: 0 + 3 * wallPartHalfSize },
          { x: 0 + 3 * wallPartHalfSize, y: 0 + 3 * wallPartHalfSize },
          { x: 0 + 5 * wallPartHalfSize, y: 0 + 3 * wallPartHalfSize },
          { x: 0 + 7 * wallPartHalfSize, y: 0 + 3 * wallPartHalfSize }
        ],
        [
          { x: 0 + wallPartHalfSize, y: 0 + 5 * wallPartHalfSize },
          { x: 0 + 3 * wallPartHalfSize, y: 0 + 5 * wallPartHalfSize },
          { x: 0 + 5 * wallPartHalfSize, y: 0 + 5 * wallPartHalfSize },
          { x: 0 + 7 * wallPartHalfSize, y: 0 + 5 * wallPartHalfSize }
        ],
        [
          { x: 0 + wallPartHalfSize, y: 0 + 7 * wallPartHalfSize },
          { x: 0 + 3 * wallPartHalfSize, y: 0 + 7 * wallPartHalfSize },
          { x: 0 + 5 * wallPartHalfSize, y: 0 + 7 * wallPartHalfSize },
          { x: 0 + 7 * wallPartHalfSize, y: 0 + 7 * wallPartHalfSize }
        ]
      ];
      let borderObject = GeometryService.calculateBorderObjectFromPartsAndSize(
        parts,
        8 * wallPartHalfSize,
        8 * wallPartHalfSize
      );
      expect(borderObject.borderX).to.equal(0 + 2 * wallPartHalfSize);
      expect(borderObject.borderY).to.equal(0 + 2 * wallPartHalfSize);
      expect(borderObject.borderWidth).to.equal(4 * wallPartHalfSize);
      expect(borderObject.borderHeight).to.equal(4 * wallPartHalfSize);
    });
  });
});
