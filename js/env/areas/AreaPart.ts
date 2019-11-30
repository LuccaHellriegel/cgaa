export class AreaPart {
  content: any;
  width: number;
  height: number;
    x: any;
    y: any;
  constructor(content, width, height) {
    this.content = content;
    this.x = content.x;
    this.y = content.y;
    this.width = width;
    this.height = height;
  }

  deleteContent() {
    if (this.content != null) {
      this.content.destroy();
      this.content = null;
    }
  }
}
