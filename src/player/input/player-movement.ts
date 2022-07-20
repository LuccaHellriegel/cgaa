import { SelectorRect } from "../../ui/SelectorRect";
import { Player } from "../Player";

const setupMouseMovement = (
  scene: Phaser.Scene,
  player: Player,
  selectorRect: SelectorRect
) => {
  scene.input.on("pointermove", (pointer) => {
    let newX = pointer.x + scene.cameras.main.scrollX;
    let newY = pointer.y + scene.cameras.main.scrollY;

    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    let rotation =
      Phaser.Math.Angle.Between(player.x, player.y, newX, newY) +
      correctionForPhasersMinus90DegreeTopPostion;
    player.setRotation(rotation);
    if (selectorRect.active || !selectorRect.visible) {
      selectorRect.setPosition(newX, newY);
    }
  });
};

const setupWASD = (scene: Phaser.Scene) => {
  const cursors = scene.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  }) as any;
  const left = cursors.left;
  const right = cursors.right;
  const up = cursors.up;
  const down = cursors.down;

  return () => ({
    left: left.isDown,
    right: right.isDown,
    up: up.isDown,
    down: down.isDown,
  });
};

export const setupPlayerMovement = (
  scene: Phaser.Scene,
  player: Player,
  selectorRect: SelectorRect
) => {
  setupMouseMovement(scene, player, selectorRect);

  const wasd = setupWASD(scene);

  return () => {
    let { left, right, up, down } = wasd();

    if (left) {
      player.setVelocityX(-playerVelocity);
    }

    if (right) {
      player.setVelocityX(playerVelocity);
    }

    if (up) {
      player.setVelocityY(-playerVelocity);
    }

    if (down) {
      player.setVelocityY(playerVelocity);
    }

    let noButtonDown = !left && !right && !up && !down;
    if (noButtonDown) {
      player.setVelocityX(0);
      player.setVelocityY(0);
    }
  };
};

const playerVelocity = 500;
