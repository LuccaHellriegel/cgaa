import { expect } from "chai";
import { wallPartRadius } from "../js/global";
import { GeometryService } from "../js/services/GeometryService";

describe("Test GeometryService", function() {
  describe("Calculate border object", function() {
    it("Calculated border should be equal to manual calculation of 3x3 area", () => {
      let parts = [
        [
          { x: 0 + wallPartRadius, y: 0 + wallPartRadius },
          { x: 0 + 3 * wallPartRadius, y: 0 + wallPartRadius },
          { x: 0 + 5 * wallPartRadius, y: 0 + wallPartRadius }
        ],
        [
          { x: 0 + wallPartRadius, y: 0 + 3 * wallPartRadius },
          { x: 0 + 3 * wallPartRadius, y: 0 + 3 * wallPartRadius },
          { x: 0 + 5 * wallPartRadius, y: 0 + 3 * wallPartRadius }
        ],
        [
          { x: 0 + wallPartRadius, y: 0 + 5 * wallPartRadius },
          { x: 0 + 3 * wallPartRadius, y: 0 + 5 * wallPartRadius },
          { x: 0 + 5 * wallPartRadius, y: 0 + 5 * wallPartRadius }
        ]
      ];
      let borderObject = GeometryService.calculateBorderObjectFromPartsAndSize(
        parts,
        6 * wallPartRadius,
        6 * wallPartRadius
      );
      expect(borderObject.borderX).to.equal(0 + 2 * wallPartRadius);
      expect(borderObject.borderY).to.equal(0 + 2 * wallPartRadius);
      expect(borderObject.borderWidth).to.equal(2 * wallPartRadius);
      expect(borderObject.borderHeight).to.equal(2 * wallPartRadius);
    });

    it("Calculated border should be equal to manual calculation of 4x4 area", () => {
      let parts = [
        [
          { x: 0 + wallPartRadius, y: 0 + wallPartRadius },
          { x: 0 + 3 * wallPartRadius, y: 0 + wallPartRadius },
          { x: 0 + 5 * wallPartRadius, y: 0 + wallPartRadius },
          { x: 0 + 7 * wallPartRadius, y: 0 + wallPartRadius }
        ],
        [
          { x: 0 + wallPartRadius, y: 0 + 3 * wallPartRadius },
          { x: 0 + 3 * wallPartRadius, y: 0 + 3 * wallPartRadius },
          { x: 0 + 5 * wallPartRadius, y: 0 + 3 * wallPartRadius },
          { x: 0 + 7 * wallPartRadius, y: 0 + 3 * wallPartRadius }
        ],
        [
          { x: 0 + wallPartRadius, y: 0 + 5 * wallPartRadius },
          { x: 0 + 3 * wallPartRadius, y: 0 + 5 * wallPartRadius },
          { x: 0 + 5 * wallPartRadius, y: 0 + 5 * wallPartRadius },
          { x: 0 + 7 * wallPartRadius, y: 0 + 5 * wallPartRadius }
        ],
        [
          { x: 0 + wallPartRadius, y: 0 + 7 * wallPartRadius },
          { x: 0 + 3 * wallPartRadius, y: 0 + 7 * wallPartRadius },
          { x: 0 + 5 * wallPartRadius, y: 0 + 7 * wallPartRadius },
          { x: 0 + 7 * wallPartRadius, y: 0 + 7 * wallPartRadius }
        ]
      ];
      let borderObject = GeometryService.calculateBorderObjectFromPartsAndSize(
        parts,
        8 * wallPartRadius,
        8 * wallPartRadius
      );
      expect(borderObject.borderX).to.equal(0 + 2 * wallPartRadius);
      expect(borderObject.borderY).to.equal(0 + 2 * wallPartRadius);
      expect(borderObject.borderWidth).to.equal(4 * wallPartRadius);
      expect(borderObject.borderHeight).to.equal(4 * wallPartRadius);
    });
  });
});
