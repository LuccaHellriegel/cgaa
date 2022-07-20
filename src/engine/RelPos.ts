import { EnvSetup } from "../config/EnvSetup";
import Grid from "./Grid";
import { Point } from "./types-geom";

export class RelPos {
  constructor(public row: number, public column: number) {}
  toPoint(): Point {
    let x = RelPos.relativeCoordinateToReal(this.column);
    let y = RelPos.relativeCoordinateToReal(this.row);
    return { x, y };
  }

  static relativeCoordinateToReal(coordinate) {
    return 0 + EnvSetup.halfGridPartSize + coordinate * EnvSetup.gridPartSize;
  }

  static realCoordinateToRelative(coordinate) {
    return (
      (Grid.snapCoordinateToGrid(coordinate) - EnvSetup.halfGridPartSize) /
      EnvSetup.gridPartSize
    );
  }

  static fromPoint(point: Point) {
    return new RelPos(
      RelPos.realCoordinateToRelative(point.y),
      RelPos.realCoordinateToRelative(point.x)
    );
  }
}
