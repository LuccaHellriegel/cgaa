import { Gameplay } from "../../../../scenes/Gameplay";
import { displayable, TutorialStep } from "./TutorialStep";
import { Content, Tutorial } from "./Tutorial";
import { Waiter } from "./Waiter";
import { Point } from "../../../base/types";

export class TutorialStepFactory {
	private content: Content[];
	private eventList: string[];
	private listenList: any[];

	constructor(sceneToListen: Gameplay, point: Point, private display: displayable) {
		this.content = [
			{ text: "Move (WASD), \nthen Attack (Left-click)\n", position: point },
			{ text: "Open Tower Mode with F\n", position: point },
			{ text: "Move Rectangle To ", position: point }
		];

		this.eventList = ["pointerdown", "down", "down"];
		this.listenList = [sceneToListen.input, sceneToListen.cgaa.keyObjF, sceneToListen.cgaa.keyObjE];
	}

	createTutorialSteps(tutorial: Tutorial) {
		return this.eventList
			.map(
				(event, index) =>
					new TutorialStep(new Waiter(this.listenList[index], event), this.content[index], this.display, tutorial)
			)
			.reverse();
	}
}
