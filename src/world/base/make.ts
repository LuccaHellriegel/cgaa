import { BasePhysicsConfig } from "./config";

export function makePhysical(obj, baseConfig: BasePhysicsConfig) {
    baseConfig.scene.add.existing(obj);
    baseConfig.physicsGroup.add(obj);
  }