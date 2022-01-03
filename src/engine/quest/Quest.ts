import { IEventHandler } from "../events/IEventHandler";
import { DecrementCountListener } from "../events/DecrementCountListener";
import { EventSetup } from "../../config/EventSetup";

const QUEST_INACTIVE = 0b00;
const QUEST_ACTIVE = 0b001;
const QUEST_SUCCESS = 0b010;
const QUEST_FAILURE = 0b100;

//@ts-ignore
const maskCheck = (mask: number) => (state) => (state & mask) === mask;

const inactive = maskCheck(QUEST_INACTIVE);
const active = maskCheck(QUEST_ACTIVE);
const success = maskCheck(QUEST_SUCCESS);
const failure = maskCheck(QUEST_FAILURE);

export class Quest {
	state = QUEST_INACTIVE;

	constructor(private allowed: Function, private activeCallback: Function) {}

	failure() {
		return failure(this.state);
	}

	inactive() {
		return inactive(this.state);
	}

	success() {
		return success(this.state);
	}

	active() {
		return active(this.state);
	}

	activeOrSuccess() {
		return active(this.state) || success(this.state);
	}

	setActive() {
		if (this.allowed()) {
			this.state = QUEST_ACTIVE;
			this.activeCallback();
		}
	}

	setSuccess() {
		this.state = QUEST_SUCCESS;
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
				return !quests.get(rivalries.getRival(id)).activeOrSuccess();
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
