import { PlayerHealthBar } from "../game/7_GameUI/PlayerHealthBar";
import { Gameplay } from "./Gameplay";
import { PlayerSoulCounter } from "../game/7_GameUI/counters/PlayerSoulCounter";
import { CampState } from "../game/7_GameUI/CampState";
import { CounterRect } from "../game/7_GameUI/rect/CounterRect";
import { TowerCounter } from "../game/7_GameUI/counters/TowerCounter";
import { TowerSelectBar } from "../game/7_GameUI/select/bars/TowerSelectBar";
import { BuildBar, PureCounter } from "../game/7_GameUI/build/BuildBar";
import { SelectionManager } from "../game/7_GameUI/select/SelectionManager";
import { SelectorRect } from "../game/7_GameUI/SelectorRect";
import { Inputs } from "../game/7_GameUI/Inputs";
import { UIState } from "../game/7_GameUI/UIState";
import { BuildManager } from "../game/7_GameUI/build/BuildManager";
import { InteractionSelectBar } from "../game/7_GameUI/select/bars/InteractionSelectBar";
import { Popup } from "../game/7_GameUI/Popup";
import { ClickableImageRect, ImageRect } from "../game/7_GameUI/rect/DoubleRect";
import { FriendCounter } from "../game/7_GameUI/counters/FriendCounter";
import { EventSetup } from "../game/0_GameBase/setup/EventSetup";
import { CampSetup } from "../game/0_GameBase/setup/CampSetup";
import { TowerSetup } from "../game/0_GameBase/setup/TowerSetup";

import GameOver from "../assets/game-over-sprite.png";

let screenWidth = 1280;
let screenLength = 720;

export class HUD extends Phaser.Scene {
	playerHealthBar: PlayerHealthBar;
	ourGame: Gameplay;
	playerSoulCounter: PlayerSoulCounter;
	campStates: CampState[];
	won = false;

	constructor() {
		super({ key: "HUD", active: true });
	}

	private setupEventListeners() {
		this.ourGame.events.on(EventSetup.partialDamage + "player", this.damagePlayer.bind(this), this);

		this.ourGame.events.on(EventSetup.healPlayer, this.playerHealthBar.increase.bind(this.playerHealthBar));

		//TODO: make interaction for opening boss camp -> so you can prepare for Boss Waves
		//TODO: make a Game Over screen
		//TODO: make a Celebration scene
		this.ourGame.events.on("win", this.win.bind(this), this);
		this.ourGame.events.on("life-gained", (amount) => {
			this.playerHealthBar.increase(amount);
		});

		this.ourGame.events.on(EventSetup.gameOverEvent, this.lose.bind(this));
	}

	damagePlayer(amount) {
		if (this.playerHealthBar.decrease(amount)) {
			this.lose();
		}
	}

	lose() {
		if (!this.won) {
			//this.add.sprite(screenWidth / 2, screenLength / 2, "game-over").play("game-over-anim");

			Popup.losePopup(this, screenWidth / 2, screenLength / 2 - 150);
			this.ourGame.input.once("pointerdown", this.restartCGAA.bind(this));
		}
	}

	win() {
		this.won = true;
		setTimeout(
			function () {
				Popup.winPopup(this, screenWidth / 2, screenLength / 2 - 150);
				this.ourGame.input.once("pointerdown", this.restartCGAA.bind(this));
			}.bind(this),
			1000
		);
	}

	restartCGAA() {
		(this as HUD).sys.game.destroy(true);

		//TODO: this leaves to much heap and GC is too slow
		// document.getElementById("game").remove();
		// const canvas: HTMLCanvasElement = document.createElement("canvas");
		// canvas.id = "game";
		// document.body.appendChild(canvas);

		// new Phaser.Game(createGameConfig());
	}

	preload() {
		this.load.spritesheet("game-over", GameOver, {
			frameWidth: 960,
			frameHeight: 540,
			endFrame: 30,
		});
	}

	gameOverSprite;

	create() {
		var config = {
			key: "game-over-anim",
			frames: this.anims.generateFrameNumbers("game-over", { start: 0, end: 30 }),
			frameRate: 10,
			repeat: 0,
		};
		this.anims.create(config);

		this.playerHealthBar = new PlayerHealthBar(this);
		this.ourGame = this.scene.get("Gameplay") as Gameplay;
		this.playerSoulCounter = new PlayerSoulCounter(
			this,
			this.ourGame,
			this.playerHealthBar.x + 125,
			this.playerHealthBar.y - 30
		);

		this.setupEventListeners();

		let halfSize = 30;

		let campStates = [];

		let x;
		let y;
		this.ourGame.cgaa.waveOrder.order.forEach((color, index) => {
			x = 1280 - halfSize - 5;
			y = 0 + halfSize + 5 + index * 2 * halfSize + index * 10;
			campStates.push(new CampState(this, this.ourGame, x, y, halfSize, color, CampSetup.colorDict[color]));
		});
		this.campStates = campStates;

		//Waves should start after CampState is initialized, otherwise first Wave is not recognized
		this.ourGame.cgaaStartWaves();

		let selectionManager = new SelectionManager(this.ourGame.cgaa.input.selectorRect);
		let healerSelectBar = new TowerSelectBar(this, 0 + 180, 0 + 30 + 5 + 5, "healer");
		let shooterSelectBar = new TowerSelectBar(this, 0 + 180, 0 + 30 + 5 + 5, "shooter");
		let interactionSelectBar = new InteractionSelectBar(
			this,
			0 + 180,
			0 + 30 + 5 + 5,
			this.ourGame.cgaa.cooperation,
			selectionManager,
			this.ourGame.cgaa.quests
		);
		let selectBars = [healerSelectBar, shooterSelectBar, interactionSelectBar];
		let questFunc = function () {
			if (selectionManager.selectedUnit) {
				this.ourGame.cgaaInteraction(selectionManager.selectedUnit);
				selectBars.forEach((bar) => bar.hide());
			}
		}.bind(this);
		(interactionSelectBar.contentElements[0] as ClickableImageRect).setInteractive("pointerdown", questFunc);

		let sellFunc = function () {
			if (selectionManager.selectedUnit) {
				selectionManager.selectedUnit.poolDestroy();
				EventSetup.gainSouls(this.ourGame, selectionManager.selectedUnit.type);
				this.ourGame.events.emit(EventSetup.towerSoldEvent, selectionManager.selectedUnit.type);
				selectBars.forEach((bar) => bar.hide());
				this.ourGame.cgaa.input.selectorRect.turnOff();
			}
		}.bind(this);
		(healerSelectBar.contentElements[0] as ClickableImageRect).setInteractive("pointerdown", sellFunc);
		(shooterSelectBar.contentElements[0] as ClickableImageRect).setInteractive("pointerdown", sellFunc);

		selectionManager.setSelectBars(healerSelectBar, shooterSelectBar, interactionSelectBar);
		selectBars.forEach((bar) => bar.hide());

		let shooterCounter = new PureCounter(this, 0, 0, "", "/" + TowerSetup.maxShooters);
		let healerCounter = new PureCounter(this, 0, 0, "", "/" + TowerSetup.maxHealers);

		let buildBar = new BuildBar(this, 0 + 30, 0 + 30 + 5, shooterCounter, healerCounter);
		buildBar.hide();
		new TowerCounter("Shooter", this.ourGame, shooterCounter);
		new TowerCounter("Healer", this.ourGame, healerCounter);

		let state = new UIState(
			this.ourGame.cgaa.input.build,
			this.ourGame.cgaa.player,
			selectionManager,
			[
				...(buildBar.contentElements as ClickableImageRect[]),
				...(healerSelectBar.contentElements as ClickableImageRect[]),
				...(shooterSelectBar.contentElements as ClickableImageRect[]),
			],
			this.ourGame.cgaa.input.selectorRect,
			buildBar
		);
		this.ourGame.input.on("pointerdown", state.down.bind(state));

		const modes = Inputs.do(
			this.ourGame,
			state,
			buildBar,
			[healerSelectBar, shooterSelectBar, interactionSelectBar],
			this.ourGame.cgaa.input.selectorRect,
			selectionManager
		);
		this.ourGame.setModes(modes);

		(buildBar.contentElements[0] as ClickableImageRect).setInteractive(
			"pointerdown",
			function () {
				(buildBar.contentElements[0] as ImageRect).toggle();

				if ((buildBar.contentElements[0] as ImageRect).selected) {
					buildBar.contentElements.forEach((ele, index) => {
						if (index !== 0) ele.deselect();
					});
					(this.ourGame.cgaa.input.selectorRect as SelectorRect).turnOn();

					(this.ourGame.cgaa.input.build as BuildManager).activateHealerBuilding();
					state.setState("build");
				} else {
					(this.ourGame.cgaa.input.selectorRect as SelectorRect).turnOff();
					state.setState("select");
				}
			}.bind(this)
		);
		(buildBar.contentElements[1] as ClickableImageRect).setInteractive(
			"pointerdown",
			function () {
				(buildBar.contentElements[1] as ImageRect).toggle();

				if ((buildBar.contentElements[1] as ImageRect).selected) {
					buildBar.contentElements.forEach((ele, index) => {
						if (index !== 1) ele.deselect();
					});
					(this.ourGame.cgaa.input.selectorRect as SelectorRect).turnOn();
					(this.ourGame.cgaa.input.build as BuildManager).activateShooterBuilding();
					state.setState("build");
				} else {
					(this.ourGame.cgaa.input.selectorRect as SelectorRect).turnOff();
					state.setState("select");
				}
			}.bind(this)
		);

		let friendCounterRect = new CounterRect(
			this,
			0 + halfSize + 100,
			y + 300 + 2 * halfSize + 5 + 2 * halfSize + 5,
			8 * halfSize,
			2 * halfSize,
			"Friends alive: ",
			""
		);
		friendCounterRect.notify(this.ourGame.cgaa.friends.length);
		new FriendCounter(this.ourGame, this.ourGame.cgaa.friends, friendCounterRect);

		Popup.startPopup(this, screenWidth / 2, screenLength / 2 - 150);

		this.ourGame.events.once(
			EventSetup.conqueredEvent,
			function () {
				Popup.kingPopup(this, screenWidth / 2, screenLength / 2 - 150);
			}.bind(this)
		);
	}
}
