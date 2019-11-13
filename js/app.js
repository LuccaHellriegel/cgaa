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
    var player;
    var enemies;
    var cursors;
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
        player = new CircleHBWithWeapon(this,"character",playerGroup, 100,450)
        //this.physics.world.enable(player)
   
        createAnims(this.anims)
        
        this.cameras.main.startFollow(player);
        enemies = this.physics.add.group();
        for (let index = 0; index < 2; index++) {
            new CircleHBWithWeapon(this,"character",enemies,(index*70)+12,200)
        }
       
        this.physics.add.overlap(player.weapon, enemies, enemyCollision, null, this);
        cursors = this.input.keyboard.createCursorKeys();

        setupMovement(this.input, this.cameras, this.time)
    }

    function update ()
    {
        checkMovement(this)
    }
