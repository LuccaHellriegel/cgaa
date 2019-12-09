import { Gameplay } from "../../scenes/Gameplay";

export interface BaseConfig {
	scene: Gameplay;
}

export interface BasePhysicsExtensionConfig extends BaseConfig {
	physicGroupType: string;
}

export interface BaseManagerConfig extends BaseConfig {
	type: string;
}

export interface BasePhysicalManagerConfig extends BaseManagerConfig {
	physicGroupType: string;
}

export interface BasePhysicsConfig extends BaseConfig {
	physicsGroup;
}

export interface BasePhysicalPositionConfig extends BasePhysicsConfig {
	x: number;
	y: number;
}
