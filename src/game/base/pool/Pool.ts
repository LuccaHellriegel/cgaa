import { poolable } from "../interfaces";
import { removeEle } from "../utils";
import { Gameplay } from "../../../scenes/Gameplay";

export abstract class Pool {
	private unitDict = {};
	private activeIDArr: string[] = [];
	private inactiveIDArr: string[] = [];

	constructor(
		protected scene: Gameplay,
		private numberOfUnits: number,
		protected unitGroup: Phaser.Physics.Arcade.StaticGroup
	) {}

	init() {
		this.initPool();
		this.listenForInactiveUnits();
	}

	private listenForInactiveUnits() {
		let keys = Object.keys(this.unitDict);
		for (const key of keys) {
			this.scene.events.on("inactive-" + key, id => {
				removeEle(id, this.activeIDArr);
				this.inactiveIDArr.push(id);
			});
		}
	}

	protected abstract createNewUnit(): poolable;

	private initPool() {
		for (let index = 0; index < this.numberOfUnits; index++) {
			const newUnit = this.createNewUnit();
			Pool.poolDestroy(newUnit);
			this.unitDict[newUnit.id] = newUnit;
			this.inactiveIDArr.push(newUnit.id);
		}
	}

	static poolDestroy(unit) {
		unit.scene.events.emit("inactive-" + unit.id, unit.id);
		unit.disableBody(true, true);
		unit.setPosition(-1000, -1000);
		unit.healthbar.bar.setActive(false).setVisible(false);
		unit.healthbar.value = unit.healthbar.defaultValue;
	}

	poolActivate(unit, x, y) {
		unit.enableBody(true, x, y, true, true);
		unit.healthbar.bar.setActive(true).setVisible(true);
		unit.healthbar.move(x, y);
	}

	pop() {
		if (this.inactiveIDArr.length === 0) {
			this.initPool();
		}
		const id = this.inactiveIDArr.pop();
		this.activeIDArr.push(id);
		return this.unitDict[id];
	}

	getActiveUnits() {
		return this.activeIDArr.map(id => this.unitDict[id]);
	}
}
