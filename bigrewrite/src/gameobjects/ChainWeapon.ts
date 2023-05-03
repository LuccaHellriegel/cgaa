import { weaponGeoms } from "../geom/chainWeaponGeom";
import { weaponHeights, weaponDists } from "../data/chainWeaponData";
import { CircleChain, unitArrowHeadConfig } from "../data/chainWeaponBase";
import { EnemySize } from "../data/EnemySize";
import { listenToAnim } from "../anims/anim-listen";
import { EntityID } from "../ecs";

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

export interface PhysicsCircle extends Phaser.Physics.Arcade.Sprite {
  entityId: EntityID; //TODO: set this in the creation
}

// WEAPON

export class ChainWeapon extends Phaser.Physics.Arcade.Sprite {
  circle: PhysicsCircle;
  circleFrame1: Phaser.Physics.Arcade.Sprite;
  circleFrame2: Phaser.Physics.Arcade.Sprite;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    unitSize: EnemySize
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    //for sight
    this.setSize(444, 444);
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
    ) as PhysicsCircle;
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
    this.circleFrame1.body.debugShowBody = false;
    this.circleFrame2.body.debugShowBody = false;

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
    listenToAnim(this, {
      animComplete: true,
      attackComplete: this.finishAttack.bind(this),
      animUpdateCustom: this.alignCircles.bind(this),
    });
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
    this.anims.play("attack-" + this.texture.key);
  }

  finishAttack() {
    this.anims.play("idle-" + this.texture.key);
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

  toggle() {
    this.setVisible(!this.visible);
  }
}
