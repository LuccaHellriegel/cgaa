type ListenConfig = {
  animStartCustom?: Function;
  animUpdateCustom?: Function;
  animComplete?: boolean;
  attackComplete?: Function;
  damageComplete?: Function;
};

export function listenToAnim(
  gameObject: Phaser.GameObjects.Sprite,
  config: ListenConfig
) {
  if (config.animStartCustom)
    gameObject.on("animationstart", config.animStartCustom);
  if (config.animUpdateCustom)
    gameObject.on("animationupdate", config.animUpdateCustom);
  if (config.animComplete)
    gameObject.on(
      "animationcomplete",
      function (anim, frame) {
        gameObject.emit(partialAnimComplete + anim.key, anim, frame);
      },
      gameObject
    );
  if (config.attackComplete)
    gameObject.on(
      partialAnimComplete + "attack-" + gameObject.texture.key,
      config.attackComplete
    );
  if (config.damageComplete)
    gameObject.on(
      partialAnimComplete + "damage-" + gameObject.texture.key,
      config.damageComplete
    );
}

const partialAnimComplete = "animationcomplete_";
