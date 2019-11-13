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
        const enemies = this.physics.add.group();
        const enemyWeapons = this.physics.add.group();
        
        var graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
        var circle = new Phaser.Geom.Circle(50, 50, 30);
        graphics.fillCircleShape(circle);
        graphics.generateTexture("circle",120,120);
        graphics.destroy()

        for (let index = 0; index < 2; index++) {
            new RedEnemy(this,"circle",enemies,(index*70)+12,200, enemyWeapons)
        }
       
        this.physics.add.overlap(playerWeaponGroup, enemies, enemyCollision, null, this);
        this.physics.add.overlap(enemyWeapons, playerGroup, enemyCollision, null, this);
        game.cursors = this.input.keyboard.createCursorKeys();
        setupMovement(this.input, this.cameras, this.time)
    }

    function update ()
    {
        checkMovement()
    }
