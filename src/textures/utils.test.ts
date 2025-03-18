import { describe, it, expect } from "vitest";
import {
  calculateTextureSize,
  calculateTriangleTextureSize,
  colorToHex,
  calculateTotalTextures,
  createTextureKey,
  createTriangleTextureKey,
} from "./utils";

describe("Texture Utils", () => {
  describe("calculateTextureSize", () => {
    it("should return double the radius when no stroke width", () => {
      expect(calculateTextureSize(10)).toBe(20);
      expect(calculateTextureSize(5)).toBe(10);
      expect(calculateTextureSize(20)).toBe(40);
    });

    it("should include stroke width in the calculation", () => {
      expect(calculateTextureSize(10, 2)).toBe(24);
      expect(calculateTextureSize(5, 1)).toBe(12);
    });

    it("should ignore negative stroke widths", () => {
      expect(calculateTextureSize(10, -2)).toBe(20);
    });
  });

  describe("calculateTriangleTextureSize", () => {
    it("should calculate correct size for equilateral triangle", () => {
      // For side length 10, height is approximately 8.66
      expect(calculateTriangleTextureSize(10)).toBeCloseTo(10);
      // For side length 20, height is approximately 17.32
      expect(calculateTriangleTextureSize(20)).toBeCloseTo(20);
    });

    it("should include stroke width in the calculation", () => {
      expect(calculateTriangleTextureSize(10, 2)).toBeCloseTo(14);
      expect(calculateTriangleTextureSize(20, 5)).toBeCloseTo(30);
    });

    it("should ignore negative stroke widths", () => {
      expect(calculateTriangleTextureSize(10, -2)).toBeCloseTo(10);
    });
  });

  describe("colorToHex", () => {
    it("should convert numbers to hex strings", () => {
      expect(colorToHex(0xff0000)).toBe("#ff0000");
      expect(colorToHex(0x00ff00)).toBe("#00ff00");
      expect(colorToHex(0x0000ff)).toBe("#0000ff");
    });

    it("should pad with zeros for small numbers", () => {
      expect(colorToHex(0x000001)).toBe("#000001");
      expect(colorToHex(0x0)).toBe("#000000");
    });
  });

  describe("calculateTotalTextures", () => {
    it("should calculate correct texture count", () => {
      expect(calculateTotalTextures(5, 50, 5, 7)).toBe(70);
      expect(calculateTotalTextures(10, 20, 5, 3)).toBe(9);
    });

    it("should handle edge cases", () => {
      expect(calculateTotalTextures(10, 10, 5, 5)).toBe(5);
      expect(calculateTotalTextures(0, 10, 1, 1)).toBe(11);
    });
  });

  describe("createTextureKey", () => {
    it("should create key with required parameters", () => {
      expect(createTextureKey(10, 0xff0000)).toBe("circle_10_16711680_0_0");
    });

    it("should include optional parameters", () => {
      expect(createTextureKey(10, 0xff0000, 0x00ff00, 2)).toBe(
        "circle_10_16711680_65280_2"
      );
    });
  });

  describe("createTriangleTextureKey", () => {
    it("should create key with required parameters", () => {
      expect(createTriangleTextureKey(20, 0xff0000)).toBe(
        "triangle_20_16711680_0_0"
      );
    });

    it("should include optional parameters", () => {
      expect(createTriangleTextureKey(30, 0xff0000, 0x00ff00, 2)).toBe(
        "triangle_30_16711680_65280_2"
      );
    });
  });
});
