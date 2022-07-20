import { Point } from "../engine/types-geom";

export class Enemies {
  private idDict = {};
  constructor() {}

  set(id: string, enemy) {
    this.idDict[id] = enemy;
  }

  addEnemy(enemy) {
    this.set(enemy.id, enemy);
  }

  getAllEnemyPositions() {
    return this.getEnemyPositions(Object.keys(this.idDict));
  }

  getEnemyPositions(ids): Point[] {
    let positions: Point[] = [];
    for (let index = 0; index < ids.length; index++) {
      positions.push({
        x: this.idDict[ids[index]].x,
        y: this.idDict[ids[index]].y,
      });
    }

    return positions;
  }

  get(id: string) {
    return this.idDict[id];
  }

  destroyEnemies(ids) {
    ids.forEach((id) => this.idDict[id].destroy());
  }
}
