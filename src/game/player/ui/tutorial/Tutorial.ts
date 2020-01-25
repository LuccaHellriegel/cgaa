import { TutorialStep } from "./TutorialStep";
import { HUD } from "../../../../scenes/HUD";
import { Box } from "./Box";
import { Point } from "../../../base/types";
import { TutorialStepFactory } from "./TutorialStepFactory";
import { Inputs } from "../../input/Inputs";

export type Content = { text: string; position: Point; tech: { listen; event } };

export class Tutorial {
	private reversedTutorialSteps: TutorialStep[] = [];
	private box: Box;

	constructor(sceneToUse: HUD, inputs: Inputs, x: number, y: number) {
		this.box = new Box(x, y, sceneToUse.add.graphics({}), sceneToUse);
		this.reversedTutorialSteps = new TutorialStepFactory(inputs, { x, y }, this.box).createTutorialSteps(this);
		this.nextStep();
	}

	nextStep() {
		if (this.reversedTutorialSteps.length !== 0) {
			this.reversedTutorialSteps.pop().activate();
		} else {
			this.box.destroy();
		}
	}
}
