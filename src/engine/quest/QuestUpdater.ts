import { IEventHandler } from "../collections/IEventHandler";
import { QuestStateMap } from "./QuestStateMap";

export abstract class QuestUpdater {
	constructor(
		protected handler: IEventHandler,
		protected questID: string,
		protected questMap: QuestStateMap,
		protected updateEvent: string
	) {
		handler.on(updateEvent, this.update.bind(this));
	}

	abstract update(stateChange?: string);
}
