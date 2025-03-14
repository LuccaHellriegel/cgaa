import { Scene } from "phaser";

interface TutorialStep {
  title: string;
  text: string;
  position: { x: number; y: number };
  highlight?: { x: number; y: number; width: number; height: number };
  action?: () => void;
}

export class Tutorial extends Scene {
  private currentStep: number = 0;
  private tutorialContainer: Phaser.GameObjects.Container | null = null;
  private highlightGraphics: Phaser.GameObjects.Graphics | null = null;
  private steps: TutorialStep[] = [];

  constructor() {
    super("Tutorial");
  }

  create(): void {
    // Create tutorial steps
    this.steps = [
      {
        title: "Welcome to Circle Gladiator Army Arena!",
        text: "In this game, you'll lead your army to conquer enemy camps and ultimately face the king.\nLet's learn the basics!",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      },
      {
        title: "Movement",
        text: "Use WASD keys to move your character.\nTry moving around now!",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 - 100 },
      },
      {
        title: "Combat",
        text: "Left-click to shoot at enemies.\nYou can also build towers to help defend against waves.",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      },
      {
        title: "Camps",
        text: "Approach enemy camps to interact with them.\nYou can either attack them or negotiate through diplomacy.",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      },
      {
        title: "Diplomacy",
        text: "When interacting with a camp, you can accept quests to gain their cooperation.\nCooperating camps will send waves to attack your targets!",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      },
      {
        title: "Towers",
        text: "Press F to enter build mode.\nClick to place towers that will automatically attack enemies.\nTowers cost souls, which you get from defeating enemies.",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      },
      {
        title: "Wave System",
        text: "Cooperating camps will send waves of enemies to attack your targets.\nDefend yourself and use the waves strategically!",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      },
      {
        title: "Ready to Play!",
        text: "You're now ready to start your conquest!\nRemember to use both combat and diplomacy to succeed.",
        position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      },
    ];

    // Create semi-transparent background
    const bg = this.add.rectangle(
      0,
      0,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    );
    bg.setOrigin(0);

    // Create container for tutorial elements
    this.tutorialContainer = this.add.container(0, 0);

    // Create highlight graphics
    this.highlightGraphics = this.add.graphics();

    // Show first step
    this.showStep(0);

    // Add skip button
    const skipButton = this.add
      .text(this.scale.width - 20, 20, "Skip Tutorial", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => skipButton.setTint(0x00ff00))
      .on("pointerout", () => skipButton.clearTint())
      .on("pointerdown", () => this.startGame());

    // Add keyboard controls
    this.input.keyboard?.on("keydown-SPACE", () => this.nextStep());
    this.input.keyboard?.on("keydown-ENTER", () => this.nextStep());

    // Add click anywhere text
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 40,
        "Press SPACE or ENTER to continue",
        {
          fontSize: "18px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);
  }

  private showStep(index: number): void {
    if (!this.tutorialContainer) return;

    // Clear previous step
    this.tutorialContainer.removeAll(true);
    if (this.highlightGraphics) {
      this.highlightGraphics.clear();
    }

    const step = this.steps[index];
    if (!step) return;

    // Add title
    const title = this.add
      .text(step.position.x, step.position.y - 50, step.title, {
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add description
    const text = this.add
      .text(step.position.x, step.position.y + 20, step.text, {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.tutorialContainer.add([title, text]);

    // Add highlight if specified
    if (step.highlight && this.highlightGraphics) {
      this.highlightGraphics
        .lineStyle(2, 0xffff00)
        .strokeRect(
          step.highlight.x,
          step.highlight.y,
          step.highlight.width,
          step.highlight.height
        );
    }

    // Execute step action if any
    if (step.action) {
      step.action();
    }
  }

  private nextStep(): void {
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      this.startGame();
    } else {
      this.showStep(this.currentStep);
    }
  }

  private startGame(): void {
    // Clean up
    if (this.tutorialContainer) {
      this.tutorialContainer.destroy();
    }
    if (this.highlightGraphics) {
      this.highlightGraphics.destroy();
    }

    // Start the game
    this.scene.start("Game");
  }

  public destroy(): void {
    // Clean up event listeners
    this.input.keyboard?.off("keydown-SPACE");
    this.input.keyboard?.off("keydown-ENTER");

    // Clean up graphics
    if (this.tutorialContainer) {
      this.tutorialContainer.destroy();
    }
    if (this.highlightGraphics) {
      this.highlightGraphics.destroy();
    }
  }
}
