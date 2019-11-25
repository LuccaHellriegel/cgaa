function createNonRepeatingAnim(anims, key, texture, start, end, frameRate){
    anims.create({
        key: key,
        frames: anims.generateFrameNumbers(texture, { start: start, end: end }),
        frameRate: frameRate,
        repeat: 0,
    });
}

function createWeaponAnims(anims){
    createNonRepeatingAnim(anims, "idle-randWeapon", "randWeapon", 1, 1, 10)
    createNonRepeatingAnim(anims, "attack-randWeapon", "randWeapon", 1, 2, 10)
    createNonRepeatingAnim(anims, "idle-chainWeapon", "chainWeapon", 1, 1, 10)
    createNonRepeatingAnim(anims, "attack-chainWeapon", "chainWeapon", 1, 3, 10)
}

function createCircleAnims(anims){
    createNonRepeatingAnim(anims, "idle-redCircle", "redCircle", 1, 1, 10)
    createNonRepeatingAnim(anims, "damage-redCircle", "redCircle", 1, 2, 10)
    createNonRepeatingAnim(anims, "idle-blueCircle", "blueCircle", 1, 1, 10)
    createNonRepeatingAnim(anims, "damage-blueCircle", "blueCircle", 1, 2, 10)
}

function createAnims(anims){
    createWeaponAnims(anims)
    createCircleAnims(anims)
}

module.exports = {
    createAnims
}