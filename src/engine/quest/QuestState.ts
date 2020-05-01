export class QuestState {
	static doneState = "done";
	static acceptedState = "accepted";
	static inactiveState = "inactive";

	private state = QuestState.inactiveState;

	accept() {
		this.state = QuestState.acceptedState;
	}

	hasBeenAccepted() {
		return this.state == QuestState.acceptedState;
	}

	isDone() {
		return this.state == QuestState.doneState;
	}

	done() {
		this.state = QuestState.doneState;
	}
}
