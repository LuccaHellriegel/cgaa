function createAnims(anims){
    //TODO: does not change back to idle
    anims.create({
        key: 'idle',
        frames: [{key: "randWeapon", frame: 1}],
        frameRate: 50,
        repeat: 0,
    });

    //TODO: animation callback instead of delayed call
    anims.create({
        key: 'attack',
        frames: anims.generateFrameNumbers('randWeapon', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: 0,
    });
}

module.exports = {
    createAnims
}