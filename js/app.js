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
            create: create,
            update: update
        }
    };

    //TODO: var to let and const
    //TODO: eslint
    var game = new Phaser.Game(config);

    //TODO: where to put this? 
    //TODO: why not juste fill in graphics? Why use additional object?
    function generateCircleTexture(hexColor, title, radius, scene){
        var graphics = scene.add.graphics({ fillStyle: { color: hexColor } });
        var circle = new Phaser.Geom.Circle(radius, radius, radius);
        graphics.fillCircleShape(circle);
        graphics.generateTexture(title,2*radius,2*radius);
        graphics.destroy()
    
    }

    function create ()
    {

        generateRandWeapon(0x6495ED, this)

        let playerGroup = this.physics.add.group();
        let playerWeaponGroup = this.physics.add.group()

        generateCircleTexture(0x6495ED, "blueCircle", 30, this)
        game.player = new UnitHBWithWeapon(this,"blueCircle",playerGroup, 100,450, playerWeaponGroup)
        //TODO: hitbox is still not accurate
        game.player.setCircle(30)

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
