function createAnims(anims){
    anims.create({
        key: 'attack',
        frames: anims.generateFrameNumbers('weapon', [0,1]),
        frameRate: 50,
        repeat: 0,

    });

    //TODO: does not change back to idle
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('weapon', [0]),
        frameRate: 50,
        repeat: 0,

    });
}