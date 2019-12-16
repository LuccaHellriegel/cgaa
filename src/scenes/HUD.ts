import { PlayerHealthBar } from "../game/player/ui/PlayerHealthBar";
import { PlayerSoulCounter } from "../game/player/ui/counters/PlayerSoulCounter";
import { PlayerKilllist } from "../game/player/ui/PlayerKilllist";
import { CampStates } from "../game/player/ui/CampStates";
import { executeOverAllCamps } from "../game/base/globals/global";
import { CampState } from "../game/player/ui/CampState";
import { campHexColors } from "../game/base/globals/globalColors";

export class HUD extends Phaser.Scene {
	playerHealthBar: PlayerHealthBar;
	ourGame: any;
	playerSoulCounter: PlayerSoulCounter;
	playerKilllist: PlayerKilllist;

	constructor() {
		super({ key: "HUD", active: true });
	}

	private setupEventListeners() {
		this.ourGame.events.on(
			"damage-player",
			function(amount) {
				if (this.playerHealthBar.decrease(amount)) {
					this.ourGame.scene.restart();
					this.playerSoulCounter.reset();
					this.playerHealthBar.value = 100;
					this.playerHealthBar.decrease(0);
					this.playerKilllist.reset();
				}
			},
			this
		);
		this.ourGame.events.on("life-gained", amount => {
			this.playerHealthBar.increase(amount);
		});
	}

	create() {
		this.playerHealthBar = new PlayerHealthBar(this);
		this.ourGame = this.scene.get("Gameplay");

		this.playerSoulCounter = new PlayerSoulCounter(
			this,
			this.ourGame,
			this.playerHealthBar.x - 30,
			this.playerHealthBar.y - 20
		);

		this.setupEventListeners();

		let halfSize = 30;

		executeOverAllCamps((color, index) => {
			let x = 0 + halfSize + 5;
			let y = 0 + halfSize + 5 + index * 2 * halfSize + index * 10;
			new CampState(this, this.ourGame, x, y, halfSize, color, 0xffffff, campHexColors[index]);
		});
	}
}
