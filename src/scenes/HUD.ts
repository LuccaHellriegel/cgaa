import { createGameConfig } from "../app";
import { PlayerHealthBar } from "../game/ui/healthbar/PlayerHealthBar";
import { Gameplay } from "./Gameplay";
import { PlayerSoulCounter } from "../game/ui/counters/PlayerSoulCounter";
import { CampState } from "../game/ui/state/CampState";
import { CampSetup } from "../game/setup/CampSetup";
import { SelectBar } from "../game/ui/selectbar/SelectBar";
import { EventSetup } from "../game/setup/EventSetup";

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
			EventSetup.partialDamage + "-player",
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

		this.ourGame.events.on(EventSetup.healPlayer, this.playerHealthBar.increase.bind(this.playerHealthBar));

		//TODO: make interaction for opening boss camp -> so you can prepare for Boss Waves
		//TODO: make a Game Over screen
		//TODO: make a Celebration scene
		this.ourGame.events.on(
			"win",
			function() {
				(this as HUD).sys.game.destroy(true);

				document.getElementById("game").remove();
				const canvas: HTMLCanvasElement = document.createElement("canvas");
				canvas.id = "game";
				document.body.appendChild(canvas);

				new Phaser.Game(createGameConfig());
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

		this.ourGame.cgaa.waveOrder.order.forEach((color, index) => {
			x = 1280 - halfSize - 5;
			y = 0 + halfSize + 5 + index * 2 * halfSize + index * 10;
			campStates.push(new CampState(this, this.ourGame, x, y, halfSize, color, 0xffffff, CampSetup.colorDict[color]));
		});
		this.campStates = campStates;

		//Waves should start after CampState is initialized, otherwise first Wave is not recognized
		this.ourGame.startWaves();

		//TODO
		//new Tutorial(this, this.ourGame.cgaa.inputs, 0 + halfSize + 5, y + 300);

		new SelectBar(this, 0 + 5, 0 + 30 + 5, this.ourGame.cgaa.inputs, this.ourGame.cgaa.selectBarState);
	}
}
