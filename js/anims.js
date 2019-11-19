function createAnims(anims){
    anims.create({
        key: 'attack',
        frames: anims.generateFrameNumbers('randWeapon', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: 0,
    });
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('randWeapon', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: 0,
    });
}

module.exports = {
    createAnims
}