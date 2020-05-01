import { QuestUpdater } from "./QuestUpdater";
import { IEventHandler } from "../collections/IEventHandler";
import { QuestStateMap } from "./QuestStateMap";

export class KillQuestUpdater extends QuestUpdater {
	constructor(
		handler: IEventHandler,
		questID: string,
		questMap: QuestStateMap,
		killEvent: string,
		private amountToKill: number,
		private successEvent: string
	) {
		super(handler, questID, questMap, killEvent);
	}

	update() {
		this.amountToKill--;
		if (this.amountToKill == 0) {
			this.questMap.done(this.questID);
			this.handler.off(this.updateEvent, this.update);
			this.handler.emit(this.successEvent, this.questID);
		}
	}
}
