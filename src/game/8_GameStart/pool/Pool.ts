import { Gameplay } from "../../../scenes/Gameplay";
import { UnitDict } from "../../0_GameBase/engine/Dict";
import { Util } from "../../0_GameBase/engine/Util";
import { poolable } from "../../0_GameBase/engine/interfaces";

export abstract class Pool {
	activeIDArr: string[] = [];
	inactiveIDArr: string[] = [];

	constructor(
		protected scene: Gameplay,
		private numberOfUnits: number,
		protected unitGroup?: Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group,
		protected unitDict = new UnitDict([])
	) {}

	init() {
		this.initPool();
		this.listenForInactiveUnits();
	}

	private listenForInactiveUnits() {
		let keys = Object.keys(this.unitDict.dict);
		for (const key of keys) {
			this.scene.events.on("inactive-" + key, (id) => {
				Util.removeEle(id, this.activeIDArr);
				this.inactiveIDArr.push(id);
			});
		}
	}

	protected abstract createNewUnit(): poolable;

	private initPool() {
		console.log("Init Pool", this.constructor.name, this.numberOfUnits, this.inactiveIDArr.length);

		for (let index = 0; index < this.numberOfUnits; index++) {
			const newUnit = this.createNewUnit();
			newUnit.poolDestroy();
			this.unitDict.set(newUnit.id, newUnit);
			this.inactiveIDArr.push(newUnit.id);
		}
	}

	pop(): poolable {
		if (this.inactiveIDArr.length < this.numberOfUnits / 3) {
			this.initPool();
		}
		const id = this.inactiveIDArr.pop();
		this.activeIDArr.push(id);
		return this.unitDict.get(id);
	}

	getActiveUnits() {
		return this.activeIDArr.map((id) => this.unitDict.get(id));
	}
}
