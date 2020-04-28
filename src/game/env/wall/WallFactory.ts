import { Gameplay } from "../../../scenes/Gameplay";
import { WallSide } from "./WallSide";
import { RelPos } from "../../base/RelPos";

export class WallFactory {
	constructor(private scene: Gameplay, private addEnv) {}

	produce(positions: RelPos[][]): WallSide[] {
		return positions.map((posArr) => {
			return new WallSide(
				this.scene,
				this.addEnv,
				posArr.map((pos) => pos.toPoint())
			);
		});
	}
}
