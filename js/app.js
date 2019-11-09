
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
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

    var player;
    var enemies;
    var cursors;
    var input;  
    var cameras; 
    var game = new Phaser.Game(config);


    function preload ()
    {
        this.load.spritesheet("character", "./assets/circle.png", {frameWidth: 64, frameHeight: 64})
    }

    function create ()
    {
        player = this.physics.add.sprite(100, 450, 'character');
        this.cameras.main.startFollow(player);
        enemies = this.physics.add.group();
        for (let index = 0; index < 2; index++) {
            enemies.add(new EnemyCircle(this,(index*70)+12,200))
        }
       
        this.physics.add.overlap(player, enemies, enemyCollision, null, this);
        input = this.input
        cursors = this.input.keyboard.createCursorKeys();
        cameras = this.cameras
    }

    function update ()
    {
        checkMovement(this)
    }
