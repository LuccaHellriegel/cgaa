import { RectPolygon } from "../../../base/polygons/RectPolygon";
import { CirclePolygon } from "../../../base/polygons/CirclePolygon";
import { ArrowHeadPolygon } from "../../../base/polygons/ArrowHeadPolygon";
import { SymmetricCrossPolygon } from "../../../base/polygons/SymmetricCrossPolygon";
import { Gameplay } from "../../../../scenes/Gameplay";
import { HUD } from "../../../../scenes/HUD";
import { colorDict } from "../../../base/globals/globalColors";

const circleCorrection = -5;

export class CampState {
	graphics: Phaser.GameObjects.Graphics;
	background: RectPolygon;
	foreground: CirclePolygon;
	redCircle: CirclePolygon;
	sideArrow: ArrowHeadPolygon;
	sideCross: SymmetricCrossPolygon;
	targetBackground: RectPolygon;
	targetForeground: CirclePolygon;

	constructor(
		sceneToUse: HUD,
		private sceneToListen: Gameplay,
		x,
		y,
		halfSize,
		private color: string,
		private backgroundHexColor,
		private foregroundHexColor
	) {
		this.graphics = sceneToUse.add.graphics({});

		this.background = new RectPolygon(x, y, 2 * halfSize, 2 * halfSize);
		this.foreground = new CirclePolygon(x, y, halfSize + circleCorrection);

		this.redCircle = new CirclePolygon(x, y, halfSize + circleCorrection + 4);

		this.sideArrow = new ArrowHeadPolygon(x + 2 * halfSize + 10, y, 1.5 * halfSize, 2 * halfSize);
		this.sideArrow.rotate(Phaser.Math.DegToRad(90));

		this.sideCross = new SymmetricCrossPolygon(x + 2 * halfSize + 10, y, 2 * halfSize, 0.4 * halfSize);
		this.sideCross.rotate(Phaser.Math.DegToRad(45));

		this.targetBackground = new RectPolygon(x + 2 * (2 * halfSize + 10), y, 2 * halfSize, 2 * halfSize);
		this.targetForeground = new CirclePolygon(x + 2 * (2 * halfSize + 10), y, halfSize + circleCorrection);
		this.reset();
	}

	reset() {
		let killlistArgs = [
			"added-to-killlist-" + this.color,
			() => {
				//TODO: killlist marking needs to be preserved if other redraw happens
				this.redrawWithKilllistMarking();
			}
		];
		let rerouteArgs = [
			"reroute-" + this.color,
			targetColor => {
				this.redraw();
				this.drawAmbushTarget(colorDict[targetColor]);
			}
		];
		let startWaveArgs = [
			"start-wave-" + this.color,
			() => {
				this.redraw();
				this.drawAmbush();
			}
		];
		let endWaveArgs = [
			"end-wave-" + this.color,
			() => {
				this.redraw();
			}
		];
		let destroyedArgs = [
			"destroyed-" + this.color,
			() => {
				this.redraw();
				this.drawDestroyed();
				let args = [killlistArgs, startWaveArgs, endWaveArgs, rerouteArgs];
				args.forEach(arg => {
					let [event, callback] = arg;
					this.sceneToListen.events.removeListener(event as string, callback as Function);
				});
			}
		];

		let args = [killlistArgs, startWaveArgs, endWaveArgs, rerouteArgs];
		args.forEach(arg => {
			let [event, callback] = arg;
			this.sceneToListen.events.removeListener(event as string, callback as Function);
		});

		this.listen(this.sceneToListen, killlistArgs);
		this.listen(this.sceneToListen, startWaveArgs);
		this.listen(this.sceneToListen, endWaveArgs);
		this.listen(this.sceneToListen, rerouteArgs);
		this.listen(this.sceneToListen, destroyedArgs);

		this.redraw();
	}

	private listen(scene: Phaser.Scene, args) {
		let [event, callback] = args;
		scene.events.on(event as string, callback as Function);
	}

	private redrawWithKilllistMarking() {
		this.graphics.clear();

		this.graphics.fillStyle(this.backgroundHexColor);
		this.background.draw(this.graphics, 0);

		this.graphics.fillStyle(0xb20000);
		this.redCircle.draw(this.graphics, 0);

		this.graphics.fillStyle(this.foregroundHexColor);
		this.foreground.draw(this.graphics, 0);
	}

	private drawDestroyed() {
		this.graphics.fillStyle(this.backgroundHexColor);
		this.sideCross.draw(this.graphics, 0);
	}

	private drawAmbushTarget(ambushTargetHex) {
		this.graphics.fillStyle(this.backgroundHexColor);
		this.targetBackground.draw(this.graphics, 0);

		this.graphics.fillStyle(ambushTargetHex);
		this.targetForeground.draw(this.graphics, 0);

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

		this.graphics.fillStyle(this.foregroundHexColor);
		this.foreground.draw(this.graphics, 0);
	}
}
