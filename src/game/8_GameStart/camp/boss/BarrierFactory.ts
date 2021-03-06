import { BossBarrier } from "./BossBarrier";
import { Gameplay } from "../../../../scenes/Gameplay";
import { Point } from "../../../0_GameBase/engine/types-geom";
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
