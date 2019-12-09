import {
	BaseConfig,
	BasePhysicsExtensionConfig,
	BaseManagerConfig,
	BasePhysicalManagerConfig,
	BasePhysicsConfig
} from "./config";

export function applyBaseConfig(obj, baseConfig: BaseConfig) {
	obj.scene = baseConfig.scene;
}

export function extendWithNewPhysicsGroup(obj, baseConfig: BasePhysicsExtensionConfig) {
	obj.physicsGroup = baseConfig.scene.physics.add[baseConfig.physicGroupType]();
}

export function applyBaseManagerConfig(obj, baseConfig: BaseManagerConfig) {
	this.applyBaseConfig(obj, baseConfig);
	baseConfig.scene[baseConfig.type] = obj;
}

export function applyBasePhysicalManagerConfig(obj, baseConfig: BasePhysicalManagerConfig) {
	this.applyBaseManagerConfig(obj, baseConfig);
	this.extendWithNewPhysicsGroup(obj, baseConfig);
}

export function applyBasePhysicsConfig(obj, baseConfig: BasePhysicsConfig) {
	this.applyBaseConfig(obj, baseConfig);
	obj.physicsGroup = baseConfig.physicsGroup;
}
