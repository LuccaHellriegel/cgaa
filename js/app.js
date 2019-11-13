    var config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
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
        this.load.spritesheet("weapon", "./assets/randWeapon.png", {frameWidth:64, frameHeight: 64})
    }

    //TODO: where to put this? 
    function generateCircleTexture(hexColor, title, radius, scene){
        var graphics = scene.add.graphics({ fillStyle: { color: hexColor } });
        var circle = new Phaser.Geom.Circle(50, 50, radius);
        graphics.fillCircleShape(circle);
        graphics.generateTexture(title,4*radius,4*radius);
        graphics.destroy()
    
    }

    function create ()
    {
        let playerGroup = this.physics.add.group();
        let playerWeaponGroup = this.physics.add.group()

        generateCircleTexture(0x6495ED, "blueCircle", 30, this)
        game.player = new UnitHBWithWeapon(this,"blueCircle",playerGroup, 100,450, playerWeaponGroup)
        //TODO: hitbox is still not accurate
        game.player.setCircle(30,30,30)

        createAnims(this.anims)
        
        this.cameras.main.startFollow(game.player);
        
        const enemyWeapons = generateRedEnemyCircles(this, 5,30, playerWeaponGroup)
        this.physics.add.overlap(enemyWeapons, playerGroup, enemyCollision, null, this);

        game.cursors = this.cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D});
        setupMovement(this.input, this.cameras, this.time)
    }

    function update ()
    {
        checkMovement()
    }
