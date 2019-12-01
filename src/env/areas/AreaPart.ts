export class AreaPart {
  content: any = null;
  width: number;
  height: number;
  x: any;
  y: any;
  constructor() {
  }

  updateContent(content){
    this.content = content
    this.x = content.x;
    this.y = content.y;
    this.width = content.width;
    this.height = content.height;
  }

  deleteContent() {
    if (this.content != null) {
      this.content.destroy();
      this.content = null;
    }
  }

  isWalkable() {
    return this.content === null;
  }
}
