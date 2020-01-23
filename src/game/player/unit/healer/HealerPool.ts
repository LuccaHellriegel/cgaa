import { Healer } from "./Healer";
import { Pool } from "../../../base/pool/Pool";
import { poolable } from "../../../base/interfaces";

export class HealerPool extends Pool {
	protected createNewUnit(): poolable {
		return new Healer(this.scene, -1000, -1000, this.unitGroup);
	}
}
