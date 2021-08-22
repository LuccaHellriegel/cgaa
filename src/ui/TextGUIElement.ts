import { HUD } from "../scenes/HUD";
import { GUIElement } from "./select/bars/SelectBar";
export class TextGUIElement implements GUIElement {
	textObj: Phaser.GameObjects.Text;
	constructor(sceneToUse: HUD, private text: string, x, y, textOptions) {
		this.textObj = sceneToUse.add.text(x, y, "", textOptions);
	}
	show() {
		this.textObj.setText(this.text);
	}
	hide() {
		this.textObj.setText("");
	}
}
