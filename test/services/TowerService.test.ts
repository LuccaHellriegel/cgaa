import { expect } from "chai";
import { TowerService } from "../../src/player/towers/TowerService";
import { towerHalfSize } from "../../src/globals/globalSizes";

describe("Test TowerService", function() {
  describe("Find closest tower", function() {
    it("Same tower is closest", () => {
      let tower = { x: 1, y: 1 };
      let towers = [tower, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 100 }];
      let result = TowerService.findClosestTower(towers, tower.x, tower.y);
      expect(result).to.deep.equal({ closestTower: tower, dist: 0 });
    });

    it("Tower with dist 1 is closest", () => {
      let tower = { x: 2, y: 1 };
      let towers = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 100 }
      ];
      let result = TowerService.findClosestTower(towers, tower.x, tower.y);
      expect(result).to.deep.equal({ closestTower: { x: 1, y: 1 }, dist: 1 });
    });
    it("Tower between two towers is closest to the 0.5 one", () => {
      let tower = { x: 100, y: 100 };
      let towers = [
        { x: 50, y: 50.5 },
        { x: 150, y: 150 }
      ];
      let result = TowerService.findClosestTower(towers, tower.x, tower.y);
      expect(result.closestTower).to.deep.equal({ x: 50, y: 50.5 });
    });
  });
  describe("Test where new tower is located", function() {
    it("New tower is in row of cross to the right", () => {
      let tower = { x: 0, y: 0 };
      let result = TowerService.newTowerIsInRowOfCross(tower, 1, 0);
      expect(result).to.equal(true);
    });
    it("New tower is in row of cross to the left", () => {
      let tower = { x: 1, y: 0 };
      let result = TowerService.newTowerIsInRowOfCross(tower, 0, 0);
      expect(result).to.equal(true);
    });
    it("New tower is in column of cross to the bottom", () => {
      let tower = { x: 0, y: 0 };
      let result = TowerService.newTowerIsInColumnOfCross(tower, 0, 1);
      expect(result).to.equal(true);
    });
    it("New tower is in column of cross to the top", () => {
      let tower = { x: 0, y: 1 };
      let result = TowerService.newTowerIsInColumnOfCross(tower, 0, 0);
      expect(result).to.equal(true);
    });
    it("New tower is in column and row of cross", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 2 * towerHalfSize + towerHalfSize / 2 + 1;
      let y = 2 * towerHalfSize + towerHalfSize / 2 + 1;
      let result =
        TowerService.newTowerIsInRowOfCross(tower, x, y) && TowerService.newTowerIsInColumnOfCross(tower, x, y);
      expect(result).to.equal(true);
    });
    it("New tower is in column above and not in row of cross", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 2 * towerHalfSize + towerHalfSize / 2 + 1;
      let y = 1 * towerHalfSize;
      let resultRow = TowerService.newTowerIsInRowOfCross(tower, x, y);
      let resultColumn = TowerService.newTowerIsInColumnOfCross(tower, x, y);

      expect(resultColumn).to.equal(true);
      expect(resultRow).to.equal(false);
    });
    it("New tower is in column below and not in row of cross", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 2 * towerHalfSize + towerHalfSize / 2 + 1;
      let y = 5 * towerHalfSize;
      let resultRow = TowerService.newTowerIsInRowOfCross(tower, x, y);
      let resultColumn = TowerService.newTowerIsInColumnOfCross(tower, x, y);

      expect(resultColumn).to.equal(true);
      expect(resultRow).to.equal(false);
    });
    it("New tower is not in column and is in row of cross to the left", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 2 * towerHalfSize + towerHalfSize / 2 - 1;
      let y = 2 * towerHalfSize + towerHalfSize / 2 + 1;
      let resultRow = TowerService.newTowerIsInRowOfCross(tower, x, y);
      let resultColumn = TowerService.newTowerIsInColumnOfCross(tower, x, y);

      expect(resultColumn).to.equal(false);
      expect(resultRow).to.equal(true);
    });
    it("New tower is not in column and is in row of cross to the right", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 3 * towerHalfSize + towerHalfSize / 2 + 1;
      let y = 2 * towerHalfSize + towerHalfSize / 2 + 1;
      let resultRow = TowerService.newTowerIsInRowOfCross(tower, x, y);
      let resultColumn = TowerService.newTowerIsInColumnOfCross(tower, x, y);

      expect(resultColumn).to.equal(false);
      expect(resultRow).to.equal(true);
    });
    it("New tower is in top edges of closest tower", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 0;
      let y = 0;
      let result = TowerService.newTowerIsInTopEdges(tower, x, y);

      expect(result).to.equal(true);
    });
    it("New tower is not in top edges of closest tower, it is in bottom edges", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 5 * towerHalfSize;
      let y = 5 * towerHalfSize;
      let result = TowerService.newTowerIsInTopEdges(tower, x, y);

      expect(result).to.equal(false);
    });
    it("New tower is in bottom edges of closest tower", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 5 * towerHalfSize;
      let y = 5 * towerHalfSize;
      let result = TowerService.newTowerIsInBottomEdges(tower, x, y);

      expect(result).to.equal(true);
    });
    it("New tower is not in bottom edges, it is in top edges of closest tower", () => {
      let tower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let x = 0;
      let y = 0;
      let result = TowerService.newTowerIsInBottomEdges(tower, x, y);

      expect(result).to.equal(false);
    });
  });

  describe("Snap tower pos to closestTower", function() {
    it("Same tower is null", () => {
      let tower = { x: 1, y: 1 };
      let result = TowerService.snapTowerPosToClosestTower(tower, tower.x, tower.y);
      expect(result).to.equal(null);
    });
    it("Tower is snapped to the right", () => {
      let closestTower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let result = TowerService.snapTowerPosToClosestTower(closestTower, 3 * towerHalfSize + 1, 3 * towerHalfSize);
      expect(result).to.deep.equal({ newX: 3 * towerHalfSize + 2 * towerHalfSize, newY: 3 * towerHalfSize });
    });
    it("Tower is snapped to the left", () => {
      let closestTower = { x: 3 * towerHalfSize, y: 3 * towerHalfSize };
      let result = TowerService.snapTowerPosToClosestTower(closestTower, 2 * towerHalfSize, 3 * towerHalfSize);
      expect(result).to.deep.equal({ newX: towerHalfSize, newY: 3 * towerHalfSize });
    });
    it("Tower snapped beyond origin is null", () => {
      let closestTower = { x: 1, y: 1 };
      let result = TowerService.snapTowerPosToClosestTower(closestTower, 1, 0);
      expect(result).to.deep.equal(null);
    });
  });
});
