import { IEventHandler } from "../events/IEventHandler";
import { DecrementCountListener } from "../events/DecrementCountListener";
import { EventSetup } from "../../game/setup/EventSetup";

export enum QuestState {
	success,
	failure,
	active,
	inactive,
}

export class Quest {
	state = QuestState.inactive;

	constructor(private allowedCheck: Function, private activeCallback: Function) {}

	isSuccess() {
		return this.state == QuestState.success;
	}

	isActive() {
		return this.state == QuestState.active;
	}

	isActiveOrSuccess() {
		return this.isActive() || this.isSuccess();
	}

	setActive() {
		if (this.allowedCheck()) {
			this.state = QuestState.active;
			this.activeCallback();
		}
	}

	setSuccess() {
		this.state = QuestState.success;
	}

	static killQuest(
		scene,
		rivalries,
		quests,
		id,
		handler: IEventHandler,
		killEvent: string,
		killProperty: string,
		count: number,
		successEvent: string,
		successPayload: any
	) {
		const quest = new Quest(
			() => {
				return !quests.hasBeenAccepted(rivalries.getRival(id));
			},
			() => {
				let rivalID = rivalries.getRival(id);
				scene.events.emit(EventSetup.questAcceptedEvent, rivalID);
			}
		);
		new DecrementCountListener(
			handler,
			killEvent,
			count,
			(killPayload) => killPayload === killProperty,
			() => {
				quest.setSuccess();
				handler.emit(successEvent, successPayload);
			}
		);
		return quest;
	}
}
