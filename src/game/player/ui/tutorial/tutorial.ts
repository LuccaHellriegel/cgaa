import { Ticker } from "./Ticker";
import { Box } from "./Box";
import { HUD } from "../../../../scenes/HUD";
import { Gameplay } from "../../../../scenes/Gameplay";

export function initTutorial(sceneToUse: HUD, sceneToListen: Gameplay, x: number, y: number) {
	this.graphics = sceneToUse.add.graphics({});

	const box = new Box(x, y, this.graphics, sceneToUse);

	const steps = ["Move (WASD), \nthen Attack (Left-click)\n", "Open Tower Mode with F\n", "Move Rectangle To "];
	const eventList = ["pointerdown", "down", "down"];
	const listenList = [sceneToListen.input, sceneToListen.cgaa.keyObjF, sceneToListen.cgaa.keyObjE];

	new Ticker(box, steps, eventList, listenList).tick();
}
