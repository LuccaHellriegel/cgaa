export class AreaPosition {
	content: any = null;
	width: number;
	height: number;
	x: any;
	y: any;
	contentType: any;
	constructor(content) {
		this.content = content;
	}

	updateContent(content, contentType) {
		this.content = content;
		this.contentType = contentType;
		this.x = content.x;
		this.y = content.y;
		this.width = content.width;
		this.height = content.height;
	}

	setAsExit() {
		if (this.content != null) {
			this.content.destroy();
			this.content = null;
			this.contentType = "exit";
		}
	}

	isSpawnable() {
		return this.isWalkable() && this.contentType !== "exit";
	}

	isWalkable() {
		return this.content === null;
	}
}
