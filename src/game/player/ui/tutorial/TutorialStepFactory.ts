import { Gameplay } from "../../../../scenes/Gameplay";
import { displayable, TutorialStep } from "./TutorialStep";
import { Content, Tutorial } from "./Tutorial";
import { Waiter } from "./Waiter";
import { Point } from "../../../base/types";

export class TutorialStepFactory {
	private content: Content[];

	constructor(sceneToListen: Gameplay, point: Point, private display: displayable) {
		let pointerdown = { event: "pointerdown", listen: sceneToListen.input };
		let towerKeyDown = { event: "down", listen: sceneToListen.cgaa.modi.keyObjTower };
		let interactKeyDown = { event: "down", listen: sceneToListen.cgaa.modi.keyObjInteraction };
		let lockKeyDown = { event: "down", listen: sceneToListen.cgaa.modi.keyObjLock };

		this.content = [
			{ text: "Move (WASD), \nthen Attack (Left-click)\n", position: point, tech: pointerdown },
			{ text: "Open Tower Mode with F\n", position: point, tech: towerKeyDown },
			{ text: "Build Tower with Left-click\n", position: point, tech: pointerdown },
			{ text: "Lock onto Tower with R\n", position: point, tech: lockKeyDown },
			{ text: "Sell Tower with Left-click\n", position: point, tech: pointerdown },
			{ text: "Close Tower Mode with F\n", position: point, tech: towerKeyDown },
			{ text: "Open Interaction Mode with E\n", position: point, tech: interactKeyDown },
			{ text: "Go to InteractionCircle \nat entrance of Camp,\n Lock on with R\n", position: point, tech: lockKeyDown },
			{
				text: "Accept Quest with Left-click\n (Quest=Destroy the Camp marked red)\n",
				position: point,
				tech: pointerdown
			},
			{ text: "Close Interaction Mode with E\nHave fun!", position: point, tech: interactKeyDown }
		];
		//TODO: cancel option
	}

	createTutorialSteps(tutorial: Tutorial) {
		return this.content
			.map(obj => new TutorialStep(new Waiter(obj.tech.listen, obj.tech.event), obj, this.display, tutorial))
			.reverse();
	}
}
