import { PlayerHealthBar } from "../game/player/ui/PlayerHealthBar";
import { PlayerSoulCounter } from "../game/player/ui/counters/PlayerSoulCounter";
import { executeOverAllCamps } from "../game/base/globals/global";
import { CampState } from "../game/player/ui/state/CampState";
import { campHexColors } from "../game/base/globals/globalColors";
import { Gameplay } from "./Gameplay";
import { Tutorial } from "../game/player/ui/tutorial/Tutorial";
import { createGameConfig } from "../app";

export class HUD extends Phaser.Scene {
	playerHealthBar: PlayerHealthBar;
	ourGame: Gameplay;
	playerSoulCounter: PlayerSoulCounter;
	campStates: CampState[];

	constructor() {
		super({ key: "HUD", active: true });
	}

	private setupEventListeners() {
		this.ourGame.events.on(
			"damage-player",
			function(amount) {
				if (this.playerHealthBar.decrease(amount)) {
					(this as HUD).sys.game.destroy(true);

					document.getElementById("game").remove();
					const canvas = document.createElement("canvas");
					canvas.id = "game";
					document.body.appendChild(canvas);

					new Phaser.Game(createGameConfig());
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
		this.ourGame = this.scene.get("Gameplay") as Gameplay;
		this.playerSoulCounter = new PlayerSoulCounter(
			this,
			this.ourGame,
			this.playerHealthBar.x - 30,
			this.playerHealthBar.y - 20
		);

		this.setupEventListeners();

		let halfSize = 30;

		let campStates = [];

		let x;
		let y;

		executeOverAllCamps((color, index) => {
			x = 0 + halfSize + 5;
			y = 0 + halfSize + 5 + index * 2 * halfSize + index * 10;
			campStates.push(new CampState(this, this.ourGame, x, y, halfSize, color, 0xffffff, campHexColors[index]));
		});
		this.campStates = campStates;

		new Tutorial(this, this.ourGame.cgaa.inputs, x, y + 300);
		//initTutorial(this, this.ourGame, x, y + 300);
	}
}
