import { createGameConfig } from "../app";
import { PlayerHealthBar } from "../game/ui/healthbar/PlayerHealthBar";
import { Gameplay } from "./Gameplay";
import { PlayerSoulCounter } from "../game/ui/counters/PlayerSoulCounter";
import { CampState } from "../game/ui/state/CampState";
import { CampSetup } from "../game/setup/CampSetup";
import { EventSetup } from "../game/setup/EventSetup";
import { CounterRect } from "../game/ui/CounterRect";
import { FriendCounter } from "../game/ui/FriendCounter";
import { TowerCounter } from "../game/ui/TowerCounter";
import { TowerSelectBar } from "../game/ui/select/bars/TowerSelectBar";
import { BuildBar, PureCounter } from "../game/ui/select/BuildBar";
import { SellManager } from "../game/ui/select/SellManager";
import { SelectionManager } from "../game/ui/select/SelectionManager";
import { ClosestSelector, ActiveElementCollection } from "../game/ui/select/Selector";
import { SelectBars } from "../game/ui/select/SelectBars";
import { SelectorRect } from "../game/modi/SelectorRect";
import { ImageRect, ClickableImageRect } from "../game/ui/DoubleRect";
import { UnitCompositeRect } from "../game/ui/CompositeRect";
import { Inputs } from "../game/ui/select/State";
import { UIState } from "../game/ui/select/UIState";
import { BuildManager } from "../game/ui/select/BuildManager";
import { InteractionSelectBar } from "../game/ui/select/bars/InteractionSelectBar";
import { Cooperation } from "../game/state/Cooperation";
import { TowerSetup } from "../game/setup/TowerSetup";

export class HUD extends Phaser.Scene {
	playerHealthBar: PlayerHealthBar;
	ourGame: Gameplay;
	playerSoulCounter: PlayerSoulCounter;
	campStates: CampState[];

	constructor() {
		super({ key: "HUD", active: true });
	}

	private setupEventListeners() {
		this.ourGame.events.on(EventSetup.partialDamage + "player", this.damagePlayer.bind(this), this);

		this.ourGame.events.on(EventSetup.healPlayer, this.playerHealthBar.increase.bind(this.playerHealthBar));

		//TODO: make interaction for opening boss camp -> so you can prepare for Boss Waves
		//TODO: make a Game Over screen
		//TODO: make a Celebration scene
		this.ourGame.events.on("win", this.restartCGAA.bind(this), this);
		this.ourGame.events.on("life-gained", amount => {
			this.playerHealthBar.increase(amount);
		});

		this.ourGame.events.on(EventSetup.gameOverEvent, this.restartCGAA.bind(this));
	}

	damagePlayer(amount) {
		if (this.playerHealthBar.decrease(amount)) {
			this.restartCGAA();
		}
	}

	restartCGAA() {
		(this as HUD).sys.game.destroy(true);

		document.getElementById("game").remove();
		const canvas: HTMLCanvasElement = document.createElement("canvas");
		canvas.id = "game";
		document.body.appendChild(canvas);

		new Phaser.Game(createGameConfig());
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

		let sellManager = new SellManager(this.ourGame);
		let activeColls: ActiveElementCollection[] = [
			this.ourGame.cgaa.shooterPool,
			this.ourGame.cgaa.healerPool,
			this.ourGame.cgaa.interactionCollection
		];
		let selectionManager = new SelectionManager(new ClosestSelector(activeColls), this.ourGame.cgaa.selectorRect);
		let healerSelectBar = new TowerSelectBar(this, 0 + 180, 0 + 30 + 5, "healer");
		let shooterSelectBar = new TowerSelectBar(this, 0 + 180, 0 + 30 + 5, "shooter");
		let interactionSelectBar = new InteractionSelectBar(
			this,
			0 + 180,
			0 + 30 + 5,
			this.ourGame.cgaa.cooperation,
			selectionManager
		);
		let selectBars = new SelectBars(healerSelectBar, shooterSelectBar, interactionSelectBar);
		let questFunc = function() {
			if (selectionManager.selectedUnit) {
				(this.ourGame.cgaa.cooperation as Cooperation).interactWithCircle(selectionManager.selectedUnit);
				selectBars.hide();
			}
		}.bind(this);
		(interactionSelectBar.contentElements[0] as ClickableImageRect).setInteractive("pointerdown", questFunc);

		let sellFunc = function() {
			if (selectionManager.selectedUnit) {
				sellManager.sell(selectionManager.selectedUnit);
				selectBars.hide();
				this.ourGame.cgaa.selectorRect.turnOff();
			}
		}.bind(this);
		(healerSelectBar.contentElements[0] as ClickableImageRect).setInteractive("pointerdown", sellFunc);
		(shooterSelectBar.contentElements[0] as ClickableImageRect).setInteractive("pointerdown", sellFunc);

		selectionManager.setSelectBars(selectBars);
		selectBars.hide();

		let shooterCounter = new PureCounter(this, 0, 0, "", "/" + TowerSetup.maxShooters);
		let healerCounter = new PureCounter(this, 0, 0, "", "/" + TowerSetup.maxHealers);

		let buildBar = new BuildBar(this, 0 + 30, 0 + 30 + 5, shooterCounter, healerCounter);
		buildBar.hide();
		new TowerCounter("Shooter", this.ourGame, shooterCounter);
		new TowerCounter("Healer", this.ourGame, healerCounter);

		let state = new UIState(
			this.ourGame.cgaa.build,
			this.ourGame.cgaa.player,
			selectionManager,
			[
				...(buildBar.contentElements as ClickableImageRect[]),
				...(healerSelectBar.contentElements as ClickableImageRect[]),
				...(shooterSelectBar.contentElements as ClickableImageRect[])
			],
			this.ourGame.cgaa.selectorRect,
			buildBar
		);
		this.ourGame.input.on("pointerdown", state.down.bind(state));

		new Inputs(
			this.ourGame,
			state,
			buildBar,
			[healerSelectBar, shooterSelectBar, interactionSelectBar],
			this.ourGame.cgaa.selectorRect
		);

		(buildBar.contentElements[0] as ClickableImageRect).setInteractive(
			"pointerdown",
			function() {
				(buildBar.contentElements[0] as ImageRect).toggle();

				if ((buildBar.contentElements[0] as ImageRect).selected) {
					buildBar.contentElements.forEach((ele, index) => {
						if (index !== 0) ele.deselect();
					});
					(this.ourGame.cgaa.selectorRect as SelectorRect).turnOn();

					(this.ourGame.cgaa.build as BuildManager).activateHealerBuilding();
					state.setState("build");
				} else {
					(this.ourGame.cgaa.selectorRect as SelectorRect).turnOff();
					state.setState("select");
				}
			}.bind(this)
		);
		(buildBar.contentElements[1] as ClickableImageRect).setInteractive(
			"pointerdown",
			function() {
				(buildBar.contentElements[1] as ImageRect).toggle();

				if ((buildBar.contentElements[1] as ImageRect).selected) {
					buildBar.contentElements.forEach((ele, index) => {
						if (index !== 1) ele.deselect();
					});
					(this.ourGame.cgaa.selectorRect as SelectorRect).turnOn();
					(this.ourGame.cgaa.build as BuildManager).activateShooterBuilding();
					state.setState("build");
				} else {
					(this.ourGame.cgaa.selectorRect as SelectorRect).turnOff();
					state.setState("select");
				}
			}.bind(this)
		);

		let friendCounterRect = new CounterRect(
			this,
			0 + halfSize + 5,
			y + 300 + 2 * halfSize + 5 + 2 * halfSize + 5,
			14 * halfSize,
			2 * halfSize,
			"Friends alive: ",
			""
		);
		friendCounterRect.notify(this.ourGame.cgaa.friends.length);
		new FriendCounter(this.ourGame, this.ourGame.cgaa.friends, friendCounterRect);
	}
}
