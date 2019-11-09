
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

    //TODO: var to let and const
    //TODO: eslint
    var player;
    var weapon;
    var enemies;
    var cursors;
    var input;  
    var cameras; 
    var game = new Phaser.Game(config);

    var attacking = false

    function preload ()
    {
        //TODO: more accurate hitboxes
        this.load.spritesheet("character", "./assets/circle.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("weapon", "./assets/randWeapon.png", {frameWidth:64, frameHeight: 64})
    }

    function create ()
    {
        //TODO: player class
        //TODO: container for player and weapon?
        player = new PlayerCircle(this,100,450)
        this.physics.world.enable(player)
        //this.physics.add.sprite(100, 450, 'character');
        weapon = this.physics.add.sprite(130,420, "weapon");

        //TODO: does not change back to idle
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('weapon', [0,1]),
            frameRate: 50,
            repeat: 0,

        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('weapon', [0]),
            frameRate: 50,
            repeat: 0,

        });
        
        this.cameras.main.startFollow(player);
        enemies = this.physics.add.group();
        for (let index = 0; index < 2; index++) {
            enemies.add(new EnemyCircle(this,(index*70)+12,200))
        }
       
        this.physics.add.overlap(weapon, enemies, enemyCollision, null, this);
        input = this.input
        cursors = this.input.keyboard.createCursorKeys();
        cameras = this.cameras

        input.on('pointermove', function (pointer) {
            let cursor = pointer;
            //TODO: wrong angle (45% off)
            let angle = Phaser.Math.Angle.Between(player.x, player.y, cursor.x + cameras.main.scrollX, cursor.y + cameras.main.scrollY)
            player.rotation = angle

        }, this);
               
        input.on('pointerdown', function(){
            if(!attacking){               
            attacking = true
            weapon.anims.play("attack")
            this.time.delayedCall(1000, function(){
                weapon.anims.play('idle');
                attacking = false;
            }, null, this)
        }
 
        }, this)
    }

    //TODO: Model view controller? 
    function updateWeaponPlace(){
        var point = Phaser.Math.RotateAround(new Phaser.Geom.Point(player.x+30, player.y-30), player.x, player.y, player.rotation)
        weapon.setPosition(point.x,point.y)
        weapon.rotation = player.rotation
    }


    function update ()
    {
        updateWeaponPlace()
        checkMovement(this)
    }
