import { Waiter } from "./Waiter";
import { Tutorial, Content } from "./Tutorial";

export interface displayable {
	display(content: Content);
	destroy();
}

export class TutorialStep {
	constructor(
		private waiter: Waiter,
		private content: Content,
		private display: displayable,
		private tutorial: Tutorial
	) {}

	activate() {
		this.waiter.activate(this);
		this.display.display(this.content);
	}

	confirmCompletion() {
		this.tutorial.nextStep();
	}
}
