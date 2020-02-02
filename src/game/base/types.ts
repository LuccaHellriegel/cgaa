import { Gameplay } from "../../scenes/Gameplay";

export type Exit = { exitPosition: RelativePosition; exitWidth: number; wallSide: string };

export type StaticConfig = { scene: Gameplay; physicsGroup: Phaser.Physics.Arcade.StaticGroup };

export type RelativePosition = { column: number; row: number };

export type Point = { x: number; y: number };

export type ZeroOneMap = number[][];
