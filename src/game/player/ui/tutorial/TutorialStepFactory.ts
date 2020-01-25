import { displayable, TutorialStep } from "./TutorialStep";
import { Content, Tutorial } from "./Tutorial";
import { Waiter } from "./Waiter";
import { Point } from "../../../base/types";
import { Inputs } from "../../input/Inputs";

export class TutorialStepFactory {
	private content: Content[];

	constructor(inputs: Inputs, point: Point, private display: displayable) {
		let pointerdown = { event: "pointerdown", listen: inputs.sceneInput };
		let shooterKeyDown = { event: "down", listen: inputs.fKey };
		let interactKeyDown = { event: "down", listen: inputs.eKey };
		let lockKeyDown = { event: "down", listen: inputs.rKey };

		this.content = [
			{
				text: "Move (WASD), \nthen Attack (Left-click)\n",
				position: point,
				tech: pointerdown
			},
			{ text: "Open Shooter Mode with F\n", position: point, tech: shooterKeyDown },
			{ text: "Build Shooter with Left-click\n", position: point, tech: pointerdown },
			{ text: "Lock onto Shooter with R\n", position: point, tech: lockKeyDown },
			{ text: "Sell Shooter with Left-click\n", position: point, tech: pointerdown },
			{ text: "Close Shooter Mode with F\n", position: point, tech: shooterKeyDown },
			{ text: "Open Interaction Mode with E\n", position: point, tech: interactKeyDown },
			{ text: "Go to InteractionCircle \nat entrance of Camp,\n Lock on with R\n", position: point, tech: lockKeyDown },
			{
				text: "Accept Quest with Left-click\n (Quest=Destroy the Camp marked red)\n",
				position: point,
				tech: pointerdown
			},
			{
				text:
					"Close Interaction Mode with E\nHave fun! After fullfilling the quest try interacting again with the Circle ;)",
				position: point,
				tech: interactKeyDown
			}
		];
		//TODO: cancel option
	}

	createTutorialSteps(tutorial: Tutorial) {
		return this.content
			.map(obj => new TutorialStep(new Waiter(obj.tech.listen, obj.tech.event), obj, this.display, tutorial))
			.reverse();
	}
}
