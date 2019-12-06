export class PathContainer {
  path;
  id: string;
  constructor(column, row) {
    this.id = [column, row].join("");
  }

  updatePath(path) {
    this.path = path;
  }
}
