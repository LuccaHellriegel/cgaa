import { QuestState } from "./QuestState";
import { QuestID } from "./QuestID";

export class QuestStateMap extends Map {
	add(questID: QuestID) {
		this.set(questID, new QuestState());
	}

	accept(questID: QuestID) {
		this.get(questID).accept();
	}

	hasBeenAccepted(questID: QuestID) {
		return this.get(questID).hasAccepted();
	}

	isDone(questID: QuestID) {
		return this.get(questID).isDone();
	}

	done(questID: QuestID) {
		this.get(questID).done();
	}
}
