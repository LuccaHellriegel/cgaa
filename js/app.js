    var config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    //TODO: var to let and const
    //TODO: eslint
    var game = new Phaser.Game(config);

    function preload ()
    {
        //TODO: more accurate hitboxes
        this.load.spritesheet("character", "./assets/circle.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("weapon", "./assets/randWeapon.png", {frameWidth:64, frameHeight: 64})
    }

    function create ()
    {
        let playerGroup = this.physics.add.group();
        let playerWeaponGroup = this.physics.add.group()
        game.player = new UnitHBWithWeapon(this,"character",playerGroup, 100,450, playerWeaponGroup)
   
        createAnims(this.anims)
        
        this.cameras.main.startFollow(game.player);
        
        const enemyWeapons = generateRedEnemyCircles(this, 5,30, playerWeaponGroup)
        this.physics.add.overlap(enemyWeapons, playerGroup, enemyCollision, null, this);

        game.cursors = this.input.keyboard.createCursorKeys();
        setupMovement(this.input, this.cameras, this.time)
    }

    function update ()
    {
        checkMovement()
    }
