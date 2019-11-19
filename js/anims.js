function createAnims(anims){
    anims.create({
        key: 'idleWeapon',
        frames: anims.generateFrameNumbers('randWeapon', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: 0,
    });
    anims.create({
        key: 'attack',
        frames: anims.generateFrameNumbers('randWeapon', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: 0,
    });

    anims.create({
        key: 'idleCircle',
        frames: anims.generateFrameNumbers('redCircle', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: 0,
    });
    anims.create({
        key: 'damage',
        frames: anims.generateFrameNumbers('redCircle', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: 0,
    });
}

module.exports = {
    createAnims
}