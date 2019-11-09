
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
        for (let index = 0; index < 15; index++) {
            enemies.add(new EnemyCircle(this,(index*70)+12,0))
        }
       
        this.physics.add.overlap(player, enemies, enemyCollision, null, this);

        cursors = this.input.keyboard.createCursorKeys();
    }

    function update ()
    {
        checkMovement()

    }
