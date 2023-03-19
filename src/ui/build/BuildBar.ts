import { HUD } from "../../scenes/HUD";
import { Rect } from "../rect/Rect";
import { UnitCompositeRect } from "../rect/UnitCompositeRect";
import { notifyWithVal } from "../Observer";
import { SelectBar, GUIElement } from "../select/bars/SelectBar";
import { TextGUIElement } from "../TextGUIElement";

export class BuildBar extends SelectBar {
  textEle: TextGUIElement;
  constructor(
    sceneToUse: HUD,
    x,
    y,
    shooterCounter: PureCounter,
    healerCounter: PureCounter
  ) {
    let baseRect = new Rect(sceneToUse, x, y, 100, 260, 0xd3d3d3);

    let healerX = x + 10.5;
    let healerY = y + 18;
    let healerRect = new UnitCompositeRect(
      sceneToUse,
      "healer",
      healerX,
      healerY
    );
    healerCounter.move(healerX - 16, healerY - 4);
    sceneToUse.children.bringToTop(healerCounter.textObj);

    let shooterX = x + 10.5;
    let shooterY = y + 92;
    let shooterRect = new UnitCompositeRect(
      sceneToUse,
      "shooter",
      shooterX,
      shooterY
    );
    shooterCounter.move(shooterX - 16, shooterY - 4);
    sceneToUse.children.bringToTop(shooterCounter.textObj);

    super(baseRect, [healerRect, shooterRect, shooterCounter, healerCounter]);

    this.textEle = new TextGUIElement(sceneToUse, "Build", x - 30, y - 35, {
      font: "20px Verdana ",
      color: "#000000",
      fontWeight: "bold",
    });

    this.textEle.hide();
  }

  hide() {
    super.hide();
    this.textEle.hide();
  }

  show() {
    super.show();
    this.textEle.show();
  }
}

export class PureCounter implements notifyWithVal, GUIElement {
  textObj: Phaser.GameObjects.Text;
  count = "0";
  constructor(
    sceneToUse: HUD,
    public x: number,
    public y: number,
    private prefixText: string,
    private postfixText: string
  ) {
    this.textObj = sceneToUse.add.text(
      this.x,
      this.y,
      prefixText + this.count + postfixText,
      {
        font: "25px Verdana ",
        color: "#cc0000",
        //@ts-ignore
        fontWeight: "bold",
      }
    );
  }

  hide() {
    this.textObj.setText("");
  }

  show() {
    this.textObj.setText(this.prefixText + this.count + this.postfixText);
  }

  notify(val: number) {
    this.count = val.toString();
    if (this.textObj.text !== "") {
      this.textObj.setText(this.prefixText + this.count + this.postfixText);
    }
  }

  move(x, y) {
    this.textObj.setPosition(x, y);
  }

  select() {}

  deselect() {}
}
