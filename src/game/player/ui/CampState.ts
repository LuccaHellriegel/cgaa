import { RectPolygon } from "../../base/polygons/RectPolygon";
import { CirclePolygon } from "../../base/polygons/CirclePolygon";
import { ArrowHeadPolygon } from "../../base/polygons/ArrowHeadPolygon";
import { SymmetricCrossPolygon } from "../../base/polygons/SymmetricCrossPolygon";
import { Gameplay } from "../../../scenes/Gameplay";
import { HUD } from "../../../scenes/HUD";
import { colorDict } from "../../base/globals/globalColors";

const circleCorrection = -5;

interface State {
	destroyed: boolean;
	onKilllist: boolean;
	onAmbush: boolean;
	ambushTargetHex: number;
}

export class CampState {
	graphics: Phaser.GameObjects.Graphics;
	x: any;
	y: any;
	halfSize: any;
	backGroundHexColor: any;
	foregroundHexColor: any;
	background: RectPolygon;
	foreground: CirclePolygon;
	redCircle: CirclePolygon;
	sideArrow: ArrowHeadPolygon;
	sideCross: SymmetricCrossPolygon;
	state: State;
	targetBackground: RectPolygon;
	targetForeground: CirclePolygon;

	constructor(sceneToUse: HUD, sceneToListen: Gameplay, x, y, halfSize, color, backgroundHexColor, foregroundHexColor) {
		this.graphics = sceneToUse.add.graphics({});

		this.x = x;
		this.y = y;
		this.halfSize = halfSize;
		this.backGroundHexColor = backgroundHexColor;
		this.foregroundHexColor = foregroundHexColor;

		this.background = new RectPolygon(x, y, 2 * halfSize, 2 * halfSize);
		this.foreground = new CirclePolygon(x, y, halfSize + circleCorrection);

		this.redCircle = new CirclePolygon(x, y, halfSize + circleCorrection + 4);

		this.sideArrow = new ArrowHeadPolygon(x + 2 * halfSize + 10, y, 1.5 * halfSize, 2 * halfSize);
		this.sideArrow.rotate(Phaser.Math.DegToRad(90));

		this.sideCross = new SymmetricCrossPolygon(x + 2 * halfSize + 10, y, 2 * halfSize, 0.4 * halfSize);
		this.sideCross.rotate(Phaser.Math.DegToRad(45));

		this.targetBackground = new RectPolygon(x + 2 * (2 * halfSize + 10), y, 2 * halfSize, 2 * halfSize);
		this.targetForeground = new CirclePolygon(x + 2 * (2 * halfSize + 10), y, halfSize + circleCorrection);

		sceneToListen.events.on("added-to-killlist-" + color, () => {
			this.state.onKilllist = true;
			this.redraw();
		});

		sceneToListen.events.on("destroyed-" + color, () => {
			this.state.destroyed = true;
			this.state.onKilllist = false;
			this.redraw();
		});

		sceneToListen.events.on("start-wave-" + color, () => {
			this.state.onAmbush = true;
			this.redraw();
		});

		sceneToListen.events.on("end-wave-" + color, () => {
			this.state.onAmbush = false;
			this.redraw();
		});

		sceneToListen.events.on("reroute-" + color, targetColor => {
			this.state.ambushTargetHex = colorDict[targetColor];
			this.redraw();
		});

		this.state = { destroyed: false, onKilllist: false, onAmbush: false, ambushTargetHex: null };

		this.draw();
	}

	draw() {
		let state = this.state;

		this.graphics.fillStyle(this.backGroundHexColor);
		this.background.draw(this.graphics, 0);

		if (state.onKilllist) {
			this.graphics.fillStyle(0xb20000);
			this.redCircle.draw(this.graphics, 0);
		}

		this.graphics.fillStyle(this.foregroundHexColor);
		this.foreground.draw(this.graphics, 0);

		if (state.destroyed) {
			this.graphics.fillStyle(this.backGroundHexColor);
			this.sideCross.draw(this.graphics, 0);
		}

		if (state.ambushTargetHex) {
			this.graphics.fillStyle(this.backGroundHexColor);
			this.targetBackground.draw(this.graphics, 0);

			this.graphics.fillStyle(state.ambushTargetHex);
			this.targetForeground.draw(this.graphics, 0);

			this.graphics.fillStyle(this.foregroundHexColor);
			this.sideArrow.draw(this.graphics, 0);
		}

		if (state.onAmbush) {
			this.graphics.fillStyle(this.backGroundHexColor);
			this.sideArrow.draw(this.graphics, 0);
		}
	}

	redraw() {
		this.graphics.clear();
		this.draw();
	}
}
