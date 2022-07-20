import { Gameplay } from "../scenes/Gameplay";
import { HUD } from "../scenes/HUD";
import { CampID, CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { ArrowHeadPolygon } from "../engine/polygons/ArrowHeadPolygon";
import { SymmetricCrossPolygon } from "../engine/polygons/SymmetricCrossPolygon";

const circleCorrection = -5;

export class CampState {
  background: Phaser.GameObjects.Rectangle;
  redCircle: Phaser.GameObjects.Arc;
  sideArrow: Phaser.GameObjects.Polygon;
  sideCross: Phaser.GameObjects.Polygon;
  targetBackground: Phaser.GameObjects.Rectangle;
  targetForeground: Phaser.GameObjects.Arc;

  ambushTargetHex;
  textObj: Phaser.GameObjects.Text;

  onKillist = false;
  isRerouted = false;
  hasCooperation = false;
  backgroundHexColor: number;

  constructor(
    sceneToUse: HUD,
    private sceneToListen: Gameplay,
    x,
    y,
    halfSize,
    private campID: CampID,
    private foregroundHexColor
  ) {
    this.backgroundHexColor = 0xffffff;
    this.background = sceneToUse.add.rectangle(
      x,
      y,
      2 * halfSize,
      2 * halfSize,
      this.backgroundHexColor
    );

    this.redCircle = sceneToUse.add
      .circle(x, y, halfSize + circleCorrection + 4, 0xb20000)
      .setVisible(false);
    sceneToUse.add.circle(
      x,
      y,
      halfSize + circleCorrection,
      this.foregroundHexColor
    );

    this.textObj = sceneToUse.add
      .text(x - 18, y - 25, "C", {
        font: "50px Verdana ",
        color: "#000000",
        fontStyle: "bold",
      })
      .setVisible(false);

    this.targetBackground = sceneToUse.add
      .rectangle(
        x - 2 * (2 * halfSize + 10),
        y,
        2 * halfSize,
        2 * halfSize,
        this.backgroundHexColor
      )
      .setVisible(false);
    this.targetForeground = sceneToUse.add.circle(
      x - 2 * (2 * halfSize + 10),
      y,
      halfSize + circleCorrection
    );

    const sideArrowPoints = ArrowHeadPolygon.points(
      x - 2 * halfSize - 10,
      y,
      1.5 * halfSize,
      2 * halfSize
    ).map((point) =>
      Phaser.Math.RotateAround(
        point,
        x - 2 * halfSize - 10,
        y,
        Phaser.Math.DegToRad(-90)
      )
    );
    //after rotating the arrow, height and width are reversed
    this.sideArrow = sceneToUse.add
      .polygon(
        0 + (2 * halfSize) / 2,
        0 + (1.5 * halfSize) / 2,
        sideArrowPoints,
        this.backgroundHexColor
      )
      .setVisible(false);

    const crossPoints = SymmetricCrossPolygon.points(
      x - 2 * halfSize - 10,
      y,
      2 * halfSize,
      0.4 * halfSize
    ).map((point) =>
      Phaser.Math.RotateAround(
        point,
        x - 2 * halfSize - 10,
        y,
        Phaser.Math.DegToRad(45)
      )
    );
    //after rotating the arrow, height and width are reversed
    this.sideCross = sceneToUse.add
      .polygon(
        0 + (0.4 * halfSize) / 2,
        0 + (2 * halfSize) / 2,
        crossPoints,
        this.backgroundHexColor
      )
      .setVisible(false);

    this.reset();
  }

  reset() {
    let killlistArgs = [
      EventSetup.questAcceptedEvent,
      (campID) => {
        if (campID === this.campID) {
          this.onKillist = true;
          this.redraw();
        }
      },
    ];
    let rerouteArgs = [
      EventSetup.partialReroutingEvent + this.campID,
      (targetCampID) => {
        this.ambushTargetHex = CampSetup.colorDict[targetCampID];
        this.isRerouted = true;
        this.redraw();
      },
    ];
    let startWaveArgs = [
      EventSetup.startWaveEvent,
      (campID) => {
        if (campID === this.campID) {
          this.redraw();
          this.drawAmbush();
        }
      },
    ];
    let endWaveArgs = [
      EventSetup.endWaveEvent,
      (campID) => {
        if (campID === this.campID) this.redraw();
      },
    ];
    let destroyedArgs = [
      EventSetup.campDestroyEvent,
      (campID) => {
        if (campID === this.campID) {
          this.redraw();
          this.drawDestroyed();
          let args = [killlistArgs, startWaveArgs, endWaveArgs, rerouteArgs];
          args.forEach((arg) => {
            let [event, callback] = arg;
            this.sceneToListen.events.removeListener(
              event as string,
              callback as Function
            );
          });
        }
      },
    ];
    let cooperationArgs = [
      EventSetup.cooperationEvent,
      (campID) => {
        if (campID === this.campID) {
          this.hasCooperation = true;
          this.redraw();
        }
      },
    ];

    let args = [
      killlistArgs,
      startWaveArgs,
      endWaveArgs,
      rerouteArgs,
      cooperationArgs,
    ];
    args.forEach((arg) => {
      let [event, callback] = arg;
      this.sceneToListen.events.removeListener(
        event as string,
        callback as Function
      );
    });

    this.listen(this.sceneToListen, killlistArgs);
    this.listen(this.sceneToListen, startWaveArgs);
    this.listen(this.sceneToListen, endWaveArgs);
    this.listen(this.sceneToListen, rerouteArgs);
    this.listen(this.sceneToListen, destroyedArgs);
    this.listen(this.sceneToListen, cooperationArgs);

    this.redraw();
  }

  private listen(scene: Phaser.Scene, args) {
    let [event, callback] = args;
    scene.events.on(event as string, callback as Function);
  }

  private drawDestroyed() {
    this.sideCross.setVisible(true);
  }

  private drawAmbushTarget() {
    this.targetBackground.setVisible(true);

    this.targetForeground.setFillStyle(this.ambushTargetHex);

    this.sideArrow.setFillStyle(this.foregroundHexColor).setVisible(true);
  }

  private drawAmbush() {
    this.sideArrow.setFillStyle(this.backgroundHexColor).setVisible(true);
  }

  redraw() {
    this.sideArrow.setVisible(false);
    this.sideCross.setVisible(false);

    if (this.onKillist) this.redCircle.setVisible(true);

    if (this.isRerouted) this.drawAmbushTarget();

    if (this.hasCooperation) this.textObj.setText("C");
  }
}
