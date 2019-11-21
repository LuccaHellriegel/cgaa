function createNonRepeatingAnim(anims, key, texture, start, end, frameRate){
    anims.create({
        key: key,
        frames: anims.generateFrameNumbers(texture, { start: start, end: end }),
        frameRate: frameRate,
        repeat: 0,
    });
}

function createWeaponAnims(anims){
    createNonRepeatingAnim(anims, "idleWeapon", "randWeapon", 1, 1, 10)
    createNonRepeatingAnim(anims, "attack", "randWeapon", 1, 2, 10)
}

function createCircleAnims(anims){
    createNonRepeatingAnim(anims, "idleCircle", "redCircle", 1, 1, 10)
    createNonRepeatingAnim(anims, "damage", "redCircle", 1, 2, 10)
}

function createAnims(anims){
    createWeaponAnims(anims)
    createCircleAnims(anims)
}

module.exports = {
    createAnims
}