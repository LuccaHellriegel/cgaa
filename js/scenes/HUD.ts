import { HealthBar } from "../graphic/HealthBar";
import { CompositePolygon } from "../polygon/CompositePolygon";
import { PlayerHealthBar } from "../player/PlayerHealthBar";
import { SymmetricCrossPolygon } from "../polygon/SymmetricCrossPolygon";

export class HUD extends Phaser.Scene {
  playerHealthBar: PlayerHealthBar;
  ourGame: any;
  playerSoulCount: number;
  playerSoulCountText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "HUD", active: true });
  }

  private setupEventListeners() {
    this.ourGame.events.on(
      "damage-player",
      function(amount) {
        //TODO: decrease based on attacker
        if (this.playerHealthBar.decrease(amount)) {
          this.ourGame.scene.restart();
          this.playerSoulCount = 0;
          this.playerSoulCountText.setText(this.playerSoulCount.toString());
          this.playerHealthBar.value = 100;
          this.playerHealthBar.decrease(0);
        }
      },
      this
    );

    this.ourGame.events.on(
      "damage-circle",
      function(amount) {
        //TODO: decouple damageAmount from soulCount, because if I attack 50 and only 10 lives -> only 10 souls
        this.playerSoulCount += amount;
        this.playerSoulCountText.setText(this.playerSoulCount.toString());
      },
      this
    );
  }

  create() {
    this.playerHealthBar = new PlayerHealthBar(this);

    this.playerSoulCount = 0;

    let graphics = this.add.graphics({
      fillStyle: {
        color: 0x228b22
      }
    });

    let playerSoulCountGraphic = new SymmetricCrossPolygon(
      this.playerHealthBar.x - 30,
      this.playerHealthBar.y - 20,
      50,
      25
    );

    playerSoulCountGraphic.draw(graphics, 0);
    this.playerSoulCountText = this.add.text(
      playerSoulCountGraphic.x - 17,
      playerSoulCountGraphic.y - 12,
      "0",
      { font: "20px Verdana", fill: "#ADFF2F" }
    );

    this.ourGame = this.scene.get("Gameplay");
    this.setupEventListeners()
  }
}
