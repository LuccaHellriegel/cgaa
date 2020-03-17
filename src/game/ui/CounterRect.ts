import { HUD } from "../../scenes/HUD";
import { notifyWithVal } from "./Observer";
import { Rect } from "./Rect";
export class CounterRect extends Rect implements notifyWithVal {
	textObj: Phaser.GameObjects.Text;
	count = "0";
	constructor(
		sceneToUse: HUD,
		public x: number,
		public y: number,
		width: number,
		height: number,
		private prefixText: string,
		private postfixText: string
	) {
		super(sceneToUse, x, y, width, height, 0x0000ff);
		this.textObj = this.sceneToUse.add.text(this.x - 30, this.y - 22, prefixText + this.count + postfixText, {
			font: "38px Verdana ",
			fill: "#000000",
			fontWeight: "bold"
		});
	}
	notify(val: number) {
		this.count = val.toString();
		this.textObj.setText(this.prefixText + this.count + this.postfixText);
	}
}
