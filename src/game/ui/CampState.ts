import { Gameplay } from "../../scenes/Gameplay";
import { CampSetup, CampID } from "../setup/CampSetup";
import { RectPolygon } from "../polygons/RectPolygon";
import { ArrowHeadPolygon } from "../polygons/ArrowHeadPolygon";
import { SymmetricCrossPolygon } from "../polygons/SymmetricCrossPolygon";
import { HUD } from "../../scenes/HUD";
import { EventSetup } from "../setup/EventSetup";

const circleCorrection = -5;

export class CampState {
	graphics: Phaser.GameObjects.Graphics;
	background: RectPolygon;
	redCircle: Phaser.GameObjects.Arc;
	sideArrow: ArrowHeadPolygon;
	sideCross: SymmetricCrossPolygon;
	targetBackground: RectPolygon;
	targetForeground: Phaser.GameObjects.Arc;
	onKillist = false;
	isRerouted = false;
	hasCooperation = false;
	ambushTargetHex;
	textObj: Phaser.GameObjects.Text;

	constructor(
		sceneToUse: HUD,
		private sceneToListen: Gameplay,
		x,
		y,
		halfSize,
		private campID: CampID,
		private backgroundHexColor,
		private foregroundHexColor
	) {
		this.graphics = sceneToUse.add.graphics({});

		this.background = new RectPolygon(x, y, 2 * halfSize, 2 * halfSize);

		this.redCircle = sceneToUse.add.circle(x, y, halfSize + circleCorrection + 4, 0xb20000).setVisible(false);
		sceneToUse.add.circle(x, y, halfSize + circleCorrection, this.foregroundHexColor);

		this.sideArrow = new ArrowHeadPolygon(x - 2 * halfSize - 10, y, 1.5 * halfSize, 2 * halfSize);
		this.sideArrow.rotate(Phaser.Math.DegToRad(-90));

		// sceneToUse.add
		// 	.graphics({ fillStyle: { color: this.backgroundHexColor } })
		// 	.fillPoints(SymmetricCrossPolygon.points(x - 2 * halfSize - 10, y, 2 * halfSize, 0.4 * halfSize))
		// 	.setRotation(Phaser.Math.DegToRad(45));

		this.sideCross = new SymmetricCrossPolygon(x - 2 * halfSize - 10, y, 2 * halfSize, 0.4 * halfSize);
		this.sideCross.rotate(Phaser.Math.DegToRad(45));

		this.targetBackground = new RectPolygon(x - 2 * (2 * halfSize + 10), y, 2 * halfSize, 2 * halfSize);
		this.targetForeground = sceneToUse.add.circle(x - 2 * (2 * halfSize + 10), y, halfSize + circleCorrection);
		this.reset();

		this.textObj = sceneToUse.add.text(x - 18, y - 25, "", {
			font: "50px Verdana ",
			fill: "#000000",
			fontWeight: "bold",
		});
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
						this.sceneToListen.events.removeListener(event as string, callback as Function);
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

		let args = [killlistArgs, startWaveArgs, endWaveArgs, rerouteArgs, cooperationArgs];
		args.forEach((arg) => {
			let [event, callback] = arg;
			this.sceneToListen.events.removeListener(event as string, callback as Function);
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
		this.graphics.fillStyle(this.backgroundHexColor);
		this.sideCross.draw(this.graphics, 0);
	}

	private drawAmbushTarget() {
		this.graphics.fillStyle(this.backgroundHexColor);
		this.targetBackground.draw(this.graphics, 0);

		this.targetForeground.setFillStyle(this.ambushTargetHex);

		this.graphics.fillStyle(this.foregroundHexColor);
		this.sideArrow.draw(this.graphics, 0);
	}

	private drawAmbush() {
		this.graphics.fillStyle(this.backgroundHexColor);
		this.sideArrow.draw(this.graphics, 0);
	}

	redraw() {
		this.graphics.clear();
		this.graphics.fillStyle(this.backgroundHexColor);
		this.background.draw(this.graphics, 0);

		if (this.onKillist) this.redCircle.setVisible(true);

		if (this.isRerouted) this.drawAmbushTarget();

		if (this.hasCooperation) this.textObj.setText("C");
	}
}
