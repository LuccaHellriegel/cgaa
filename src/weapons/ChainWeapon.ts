import { weaponGeoms } from "./chain-weapon-geom";
import { weaponHeights, weaponDists } from "./chain-weapon-data";
import { CircleChain, unitArrowHeadConfig } from "./chain-weapon-base";
import { UnitSetup } from "../config/UnitSetup";
import { listenToAnim } from "../anim/anim-listen";
import { EnemySize } from "../units/CircleFactory";

// PHYSICS
function circleChainToPhysicsTopCircle(
  scene: Phaser.Scene,
  chain: CircleChain,
  parent: ChainWeapon,
  frame: number,
  arrowHeight: number,
  arrowWidth,
  distArrowAndChain: number
) {
  let point = chain.points[0];
  let radius = chain.radius;
  let result = scene.physics.add
    .sprite(point.x, point.y, "")
    .setVisible(false)
    // .setActive(false)
    // to get correct circle position, we need to first change default size then set circle
    // (weird internal repositioning)
    .setSize(radius * 2, radius * 2)
    .setCircle(radius)
    .setImmovable(true)
    .setData("weapon", parent)
    .setData("frame", frame);
  let topYOfArrow = result.y - distArrowAndChain - arrowHeight / 2;
  let centerYOfNewTopCircle = topYOfArrow + arrowWidth / 2;
  result
    .setPosition(result.x, centerYOfNewTopCircle)
    .setSize(arrowWidth, arrowWidth)
    .setCircle(arrowWidth / 2);
  return result;
}

// WEAPON

export class ChainWeapon extends Phaser.Physics.Arcade.Sprite {
  owner: Phaser.Physics.Arcade.Image;
  initialized = false;
  amount: number;
  circle: Phaser.Physics.Arcade.Sprite;
  circleFrame1: Phaser.Physics.Arcade.Sprite;
  circleFrame2: Phaser.Physics.Arcade.Sprite;
  attackingFactor = 0;
  didDamageFactor = 1;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    amount: number,
    unitSize: EnemySize
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    //for sight
    this.setSize(444, 444);

    this.amount = amount;

    let geoms = weaponGeoms[unitSize];
    let smallChain = geoms.frame2.smallChain;
    let points = smallChain.points;
    let radius = smallChain.radius;
    let bottomCircleOfGeom = points[points.length - 1];
    // everything is initially aligned on the x-axis
    // so we just need to adjust y to the fact that x,y is the middle of the frame
    let diffX = x - bottomCircleOfGeom.x;
    let diffY =
      y - bottomCircleOfGeom.y - radius + weaponHeights[unitSize].frame2 / 2;

    let { height, width } = unitArrowHeadConfig[unitSize];
    let { distArrowAndChain } = weaponDists[unitSize];

    this.circle = circleChainToPhysicsTopCircle(
      this.scene,
      geoms.frame1.bigChain,
      this,
      1,
      height,
      width,
      distArrowAndChain
    );
    this.circleFrame1 = circleChainToPhysicsTopCircle(
      this.scene,
      geoms.frame1.bigChain,
      this,
      1,
      height,
      width,
      distArrowAndChain
    );
    this.circleFrame2 = circleChainToPhysicsTopCircle(
      this.scene,
      geoms.frame2.bigChain,
      this,
      1,
      height,
      width,
      distArrowAndChain
    );
    // this.circleFrame1.body.debugShowBody = false;
    // this.circleFrame2.body.debugShowBody = false;

    this.circleFrame2.setPosition(
      this.circleFrame2.x + diffX,
      this.circleFrame2.y + diffY
    );

    // we align the second frame, then the offset between the frame geoms
    this.circleFrame1.setPosition(
      this.circleFrame1.x + diffX + unitArrowHeadConfig[unitSize].width,
      this.circleFrame1.y + diffY
    );

    this.visible = true;
    this.initialized = true;

    listenToAnim(this, {
      animComplete: true,
      attackComplete: this.finishAttack.bind(this),
      animUpdateCustom: this.alignCircles.bind(this),
    });

    // this.setPosition(x, y);
    // this.enableBody(true, x, y, true, true);
    this.circle.enableBody(true, x, y, false, false);
    this.circleFrame1.enableBody(true, x, y, false, false);
    this.circleFrame2.enableBody(true, x, y, false, false);
  }

  setOwner(owner: Phaser.Physics.Arcade.Image) {
    this.owner = owner;
  }

  alignCircles(key, frame) {
    if (frame.index === 2) {
      this.circle.setPosition(this.circleFrame1.x, this.circleFrame1.y);
    } else {
      // index === 3
      this.circle.setPosition(this.circleFrame2.x, this.circleFrame2.y);
    }
  }

  attack() {
    if (this.attackingFactor === 0) {
      this.anims.play("attack-" + this.texture.key);
      this.attackingFactor = 1;
    }
  }

  finishAttack() {
    this.anims.play("idle-" + this.texture.key);
    this.attackingFactor = 0;
    this.didDamageFactor = 1;
  }

  setRotationAroundOwner() {
    // always calculate new rotation base point from current position of owner
    // this way we catch position changes of owner
    // We still need to use velocity, because it seems velocity changes are updated after preUpdate
    let point = Phaser.Math.RotateAround(
      new Phaser.Geom.Point(
        this.owner.x,
        this.owner.y -
          UnitSetup.sizeDict[this.owner.type] -
          weaponHeights[this.owner.type].frame2 / 2
      ),
      this.owner.x,
      this.owner.y,
      this.owner.rotation
    );
    this.setPhysicsPosition(point.x, point.y);
    this.setPosition(point.x, point.y);
    const radians = this.owner.rotation;
    // setRotation starts always at 0, rotate around starts at the last value
    // so we need to only rotate the difference
    for (let point of [this.circle, this.circleFrame1, this.circleFrame2])
      Phaser.Math.RotateAround(point, this.x, this.y, radians - this.rotation);
    this.setRotation(this.owner.rotation);
  }

  setPhysicsPosition(x, y) {
    let diffX = x - this.x;
    let diffY = y - this.y;
    for (let point of [this.circle, this.circleFrame1, this.circleFrame2])
      point.setPosition(point.x + diffX, point.y + diffY);
  }

  setVelocity(x, y) {
    this.setVelocityX(x);
    this.setVelocityY(y);
    return this;
  }

  setVelocityX(velo) {
    this.circle.setVelocityX(velo);
    this.circleFrame1.setVelocityX(velo);
    this.circleFrame2.setVelocityX(velo);
    return super.setVelocityX(velo);
  }

  setVelocityY(velo) {
    this.circle.setVelocityY(velo);
    this.circleFrame1.setVelocityY(velo);
    this.circleFrame2.setVelocityY(velo);
    return super.setVelocityY(velo);
  }

  destroy() {
    this.circle.destroy();
    this.circleFrame1.destroy();
    this.circleFrame2.destroy();
    super.destroy();
  }

  toggle() {
    this.setVisible(!this.visible);
  }
}
