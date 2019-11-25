import {ChainWeapon} from "../weapon/ChainWeapon"
import { CompositePolygon } from "../polygon/CompositePolygon";

export const normalCircleRadius = 30

//TODO: use polygon classes for drawing
function generateCircleTexture(hexColor, title, radius, scene) {
    let graphics = scene.add.graphics({
        fillStyle: {
            color: hexColor
        }
    });
    graphics.fillCircle(radius, radius, radius);
    graphics.fillCircle(3*radius, radius, radius);
    graphics.fillStyle(0xF08080)
    graphics.fillCircle(3*radius, radius, 2*(radius/3));
    graphics.generateTexture(title, 4 * radius, 2 * radius);
    graphics.destroy()

    scene.textures.list[title].add(1, 0, 0, 0, 2 * radius, 2 * radius)
    scene.textures.list[title].add(2, 0, 2*radius, 0, 2 * radius, 2 * radius)
}

//TODO: slight (few pixel) overlap between frames?
function generateRandWeapon(hexColor, scene) {
    let graphics = scene.add.graphics({
        fillStyle: {
            color: hexColor
        }
    });
    graphics.fillRect(27, 0, 10, 64);
    graphics.fillRect(64 + 27, 0, 10, 64)
    graphics.fillRect(64, 0, 64, 20)
    graphics.generateTexture("randWeapon", 128, 64);
    graphics.destroy()

    //add frames to texture
    scene.textures.list.randWeapon.add(1, 0, 0, 0, 64, 64)
    scene.textures.list.randWeapon.add(2, 0, 64, 0, 64, 64)
}

function generateChainWeapon(hexColor, scene) {
    let graphics = scene.add.graphics({
        fillStyle: {
            color: hexColor
        }
    });
    let weaponGroup = scene.physics.add.group();

    let arrowWidth = 42
    let arrowHeight = 21

    let topLeftX = 0
    let topLeftY = 0   

    let startCenterX = topLeftX + arrowWidth/2
    let biggerThanWeapon = 300
    let startCenterY = topLeftY - (arrowHeight/2) + biggerThanWeapon

    let chainWeapon = new ChainWeapon(scene,startCenterX,startCenterY,weaponGroup,5,2)
    startCenterY -= biggerThanWeapon   

    let finalPolygonHeight = (chainWeapon.polygonArr[2] as CompositePolygon).getHeight()
    startCenterY += finalPolygonHeight
    chainWeapon.polygon.setPosition(startCenterX,startCenterY)
    chainWeapon.polygon.draw(graphics,0)   

    let newPosOfMiddlePolygon = finalPolygonHeight - (chainWeapon.polygonArr[1].getHeight()/2)
    chainWeapon.polygonArr[1].setPosition(3*startCenterX,topLeftY + newPosOfMiddlePolygon)
    chainWeapon.polygonArr[1].draw(graphics,0)

    chainWeapon.polygonArr[2].setPosition(5*startCenterX,topLeftY + (finalPolygonHeight / 2))
    chainWeapon.polygonArr[2].draw(graphics,0)

    graphics.generateTexture("chainWeapon",arrowWidth*3, finalPolygonHeight);
    graphics.fillCircle(0,0,2)
    graphics.fillCircle(0,finalPolygonHeight,2)

    graphics.destroy()
    chainWeapon.destroy()
    weaponGroup.destroy()

    //add frames to texture
    scene.textures.list.chainWeapon.add(1, 0, 0, finalPolygonHeight - arrowHeight, arrowWidth, arrowHeight)   
    scene.textures.list.chainWeapon.add(2, 0, 0+arrowWidth, finalPolygonHeight - chainWeapon.polygonArr[1].getHeight(), arrowWidth, chainWeapon.polygonArr[1].getHeight())
    scene.textures.list.chainWeapon.add(3, 0, 0+2*arrowWidth, 0, arrowWidth, finalPolygonHeight)
}




export function generate(scene){
    generateRandWeapon(0x6495ED, scene)
    generateCircleTexture(0x6495ED, "blueCircle", normalCircleRadius, scene)
    generateCircleTexture(0xff0000, "redCircle", normalCircleRadius, scene)
    generateChainWeapon(0xff0000,scene)
}