import { PlayerHealthBar } from "../game/player/PlayerHealthBar";
import { PlayerSoulCounter } from "../game/player/counters/PlayerSoulCounter";
import { PlayerKilllist } from "../game/player/PlayerKilllist";

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

		this.playerKilllist = new PlayerKilllist(10 + 30, 10 + 60, this, this.ourGame);

		this.setupEventListeners();
	}
}
