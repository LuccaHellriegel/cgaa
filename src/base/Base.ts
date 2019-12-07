import { Gameplay } from "../scenes/Gameplay";

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

export class BaseService {
  private constructor() {}

  static applyBaseConfig(obj, baseConfig: BaseConfig) {
    obj.scene = baseConfig.scene;
  }

  static extendWithNewPhysicsGroup(obj, baseConfig: BasePhysicsExtensionConfig) {
    obj.physicsGroup = baseConfig.scene.physics.add[baseConfig.physicGroupType]();
  }

  static extendWithNewId(obj) {
    obj.id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
  }

  static applyBaseManagerConfig(obj, baseConfig: BaseManagerConfig) {
    this.applyBaseConfig(obj, baseConfig);
    baseConfig.scene[baseConfig.type] = obj;
  }

  static applyBasePhysicalManagerConfig(obj, baseConfig: BasePhysicalManagerConfig) {
    this.applyBaseManagerConfig(obj, baseConfig);
    this.extendWithNewPhysicsGroup(obj, baseConfig);
  }

  static applyBasePhysicsConfig(obj, baseConfig: BasePhysicsConfig) {
    this.applyBaseConfig(obj, baseConfig);
    obj.physicsGroup = baseConfig.physicsGroup;
  }

  static makePhysical(obj, baseConfig: BasePhysicsConfig) {
    baseConfig.scene.add.existing(obj);
    baseConfig.physicsGroup.add(obj);
  }
}
