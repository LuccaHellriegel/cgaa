import { Gameplay } from "../../scenes/Gameplay";
import { CampSetup, CampID } from "../setup/CampSetup";
import { ArrowHeadPolygon } from "../polygons/ArrowHeadPolygon";
import { SymmetricCrossPolygon } from "../polygons/SymmetricCrossPolygon";
import { HUD } from "../../scenes/HUD";
import { EventSetup } from "../setup/EventSetup";
import { IEventHandler } from "../../engine/events/IEventHandler";

interface UIElement {
	setVisible(bool): this;
	setActive(bool): this;
}

type StateConfig = {
	event: string;
	elementConfigs: { element: UIElement; func: Function }[];
};

function UIStateToggle(configs: []) {
	const activateDict = {};
	const deactivateDict = {};

	for (const config of configs) {
		const events: string[] = config[0];
		const elementsToActivate: UIElement[] = config[1];
		const elementsToDeactivate: UIElement[] = config[2];

		for (const event of events) {
			if (!activateDict[event]) activateDict[event] = [];
			activateDict[event] = (activateDict[event] as UIElement[]).concat(elementsToActivate);

			if (!deactivateDict[event]) deactivateDict[event] = [];
			deactivateDict[event] = (deactivateDict[event] as UIElement[]).concat(elementsToDeactivate);
		}
	}

	return {
		send(event: string) {
			for (const element of activateDict[event]) (element as UIElement).setActive(true).setVisible(true);
			for (const element of deactivateDict[event]) (element as UIElement).setActive(false).setVisible(false);
		},
	};
}

function UIPhaserEventToggle(handler: IEventHandler, events: string[], stateToggle: { send(event: string) }) {
	for (const event of events)
		handler.on(event, () => {
			stateToggle.send(event);
		});
}

const circleCorrection = -5;

export class CampState {
	graphics: Phaser.GameObjects.Graphics;
	background: Phaser.GameObjects.Rectangle;
	redCircle: Phaser.GameObjects.Arc;
	sideArrow: ArrowHeadPolygon;
	sideCross: SymmetricCrossPolygon;
	targetBackground: Phaser.GameObjects.Rectangle;
	targetForeground: Phaser.GameObjects.Arc;

	ambushTargetHex;
	textObj: Phaser.GameObjects.Text;

	onKillist = false;
	isRerouted = false;
	hasCooperation = false;

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

		this.background = sceneToUse.add.rectangle(x, y, 2 * halfSize, 2 * halfSize, this.backgroundHexColor);

		this.redCircle = sceneToUse.add.circle(x, y, halfSize + circleCorrection + 4, 0xb20000).setVisible(false);
		sceneToUse.add.circle(x, y, halfSize + circleCorrection, this.foregroundHexColor);

		this.textObj = sceneToUse.add
			.text(x - 18, y - 25, "C", {
				font: "50px Verdana ",
				fill: "#000000",
				fontWeight: "bold",
			})
			.setVisible(false);

		this.targetBackground = sceneToUse.add
			.rectangle(x - 2 * (2 * halfSize + 10), y, 2 * halfSize, 2 * halfSize, this.backgroundHexColor)
			.setVisible(false);
		this.targetForeground = sceneToUse.add.circle(x - 2 * (2 * halfSize + 10), y, halfSize + circleCorrection);

		this.sideArrow = new ArrowHeadPolygon(x - 2 * halfSize - 10, y, 1.5 * halfSize, 2 * halfSize);
		this.sideArrow.rotate(Phaser.Math.DegToRad(-90));

		// sceneToUse.add
		// 	.graphics({ fillStyle: { color: this.backgroundHexColor } })
		// 	.fillPoints(SymmetricCrossPolygon.points(x - 2 * halfSize - 10, y, 2 * halfSize, 0.4 * halfSize))
		// 	.setRotation(Phaser.Math.DegToRad(45));

		this.sideCross = new SymmetricCrossPolygon(x - 2 * halfSize - 10, y, 2 * halfSize, 0.4 * halfSize);
		this.sideCross.rotate(Phaser.Math.DegToRad(45));

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
		this.targetBackground.setVisible(true);

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

		if (this.onKillist) this.redCircle.setVisible(true);

		if (this.isRerouted) this.drawAmbushTarget();

		if (this.hasCooperation) this.textObj.setText("C");
	}
}
