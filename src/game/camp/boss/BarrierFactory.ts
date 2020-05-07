import { BossBarrier } from "./BossBarrier";
import { Point } from "../../base/types";
import { Gameplay } from "../../../scenes/Gameplay";
export class BarrierFactory {
	constructor(protected scene: Gameplay, private addEnv: Function) {}

	produce(positions: Point[]) {
		positions.forEach((pos) => {
			let barrier = new BossBarrier(this.scene, pos.x, pos.y);
			this.addEnv(barrier);
			return barrier;
		});
	}
}
