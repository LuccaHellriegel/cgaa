import { Gameplay } from "../../scenes/Gameplay";

export type Exit = { exitPosition: number; exitWidth: number; exitWallSide: string };

export type StaticConfig = { scene: Gameplay; physicsGroup: Phaser.Physics.Arcade.StaticGroup };

export type RelativePosition = { column: number; row: number };
