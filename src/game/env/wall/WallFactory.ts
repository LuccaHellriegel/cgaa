import { Gameplay } from "../../../scenes/Gameplay";
import { WallSide } from "./WallSide";
import { RelPos } from "../../base/RelPos";

export class WallFactory {
	constructor(private scene: Gameplay, private physicGroup: Phaser.Physics.Arcade.StaticGroup) {}

	produce(positions: RelPos[][]): WallSide[] {
		return positions.map(posArr => {
			return new WallSide(
				this.scene,
				this.physicGroup,
				posArr.map(pos => pos.toPoint())
			);
		});
	}
}
