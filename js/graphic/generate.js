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

function generate(scene){
    generateRandWeapon(0x6495ED, scene)
    generateCircleTexture(0x6495ED, "blueCircle", 30, scene)
    generateCircleTexture(0xff0000, "redCircle", 30, scene)
}

module.exports = {
    generate
}