<<<<<<< HEAD
class PhysicsExample extends Phaser.Scene 
{

    constructor() {
        super('mainscene');
        this.cursors;
        this.ship;
        this.laser;
        this.asteroid;
        this.asteroids = [];
        this.cometEmitter;
        this.boosterEmitter;
        this.particleConfig;
        this.asteroidsCollisionCategory;
        this.shipCollisionCategory;
        this.count;
        this.laserCollisionCategory;
        this.nextFire = 0;
        this.wrapBounds = {
            wrap: {
                min: { x:0, y:0},
                max: { x:800, y:600}
            }
        };
        this.cometConfig = {
            speed: 1000,
            lifespan: 1000,
            scale: {start: 0.2, end: 1},
            BlendMode: 'SCREEN', 
            frequency: 200,
            onEmit: function (particle, key, t, value) {
                this.frequencyCounter += t;
                this.depth = 3;
                this.desiredSpeed = this.speed;
                if (this.frequencyCounter >= this.frequency) {
                    this.particle.speed = desiredSpeed / Math.floor(Math.random() * 5000);
                    this.frequencyCounter = 0;
                } else {
                    return false;
                }
            },

            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Line (0, 0, 800, 600), quantity: 5
            }
        };
        // Booster Particle Config
        this.particleConfig = {
            speed: {
                onEmit: (particle, key, t, value) => this.ship.body.speed / 1,
            },
            lifespan: {
                onEmit: (particle, key, t, value) => Phaser.Math.Percent(this.ship.body.speed, 0, 100) * 4000
            },
            blendMode: 'SCREEN',
            emitZone: { type: 'line', source: new Phaser.Geom.Line(300, 300, 80, 80) },
            scale: { start: 0.001, end: 0.5 },

        };
    }

    preload()
    {
        this.load.image('ship', 'assets/ship.png');
        this.load.image('blue', 'assets/blue_particle.png');
        this.load.image('red', 'assets/red_particle.png');
        this.load.image('comet', 'assets/comet.png');
        this.load.image('bg', 'assets/background.png');
        this.load.image('rock1', 'assets/rock1.png');
        this.load.image('rock2', 'assets/rock2.png');
        this.load.image('rock3', 'assets/rock3.png');
        this.load.image('laser', 'assets/laser.png')
    }

    create() 
    {
        const space = this.add.image(0,0,'bg');
        space.setOrigin(0,0);
        space.setScale(0.6);
        space.alpha = 0.75;
        space.setDepth(0);

        this.asteroidsCollisionCategory = this.matter.world.nextCategory();
        this.laserCollisionCategory = this.matter.world.nextCategory();
        this.shipCollisionCategory = this.matter.world.nextCategory();

        this.ship = this.matter.add.image(400, 300, 'ship', null, {plugin: this.wrapBounds});
        this.ship.setFrictionAir(0.8);
        this.ship.setMass(400);
        this.ship.setScale(0.8);
        this.ship.setDepth(5);
        this.ship.setFixedRotation();
        this.ship.setCollisionCategory(this.shipCollisionCategory);
        this.boosterEmitter = this.add.particles(['red']).setDepth(4).createEmitter(this.particleConfig).startFollow(this.ship);
        this.cometEmitter = this.add.particles('comet').createEmitter(this.cometConfig).start();
        
        const generateAsteroids = this.time.addEvent ({
            delay: 2000,
            callback: createAsteroid,
            callbackScope: this,
            loop: true
        });

        // LASER handling
        this.lasers = [];
        for (let i = 0; i < 64; i++)
        {
            this.laser = new Laser(this.matter.world, -100, 100, 'laser', this.wrapBounds);
            this.laser.setCollisionCategory(this.laserCollisionCategory);
            this.laser.setCollidesWith([this.asteroidsCollisionCategory]);
            this.laser.setOnCollide(laserVsRock);
            this.lasers.push(this.laser);
        }
        this.cursors = this. input.keyboard.createCursorKeys();
    }

    update() 
    {
        //RGB comets
        this.cometEmitter.forEachAlive((particle, index) => {
            changeParticleColorAndSize(particle);
        });

        //ship movement
        if (this.cursors.left.isDown){
            this.ship.setAngularVelocity(-0.4);
       } else if (this.cursors.right.isDown){
            this.ship.setAngularVelocity(0.4);
        }
        // BOOST MODE!
        if (this.cursors.up.isDown && this.cursors.shift.isDown){
            this.ship.thrust(2.8);
        } else if (this.cursors.up.isDown){
            this.ship.thrust(2.2);
        }

        if (this.cursors.space.isDown){
            // Required for Implementing a fire rate.
            var firerate = 100;
            const laser = this.lasers.find(laser => !laser.active);
            if (laser && this.time.now > this.nextFire)
            {
                laser.fire(this.ship.x, this.ship.y, this.ship.rotation, 20);
                this.nextFire = this.time.now + firerate;
            }
        }
    }
}
// Insert Function and additional Classes Here

//make comets size and colour random
function changeParticleColorAndSize(particle) {
    const newColor = Phaser.Display.Color.RandomRGB();
    particle.tint = newColor.color;
    particle.scale = Math.random();
}

//asteroids

class Asteroid extends Phaser.Physics.Matter.Sprite
{
    constructor(world, x, y, texture, frame, bodyOptions)
    {
        super(world, x, y, texture, frame, { plugin: bodyOptions });
        this.setFrictionAir(0);
        this.scene.add.existing(this);
        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.FloatBetween(0.5, 4);
        const scale = Phaser.Math.FloatBetween(0.1, 0.2)
        this.setScale(scale);
        this.setMass(100 / scale * 2)
        this.setAngle(angle);
        this.setAngularVelocity(Phaser.Math.FloatBetween(-0.05, 0.05));
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);
    }
}
function createAsteroid()
    {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        let asteroid;

        switch (Math.floor(Math.random() * (3 - 0 + 1) + 1))
        {
            case 1:
                asteroid = new Asteroid(this.matter.world, x, y, 'rock1', null, this.wrapBounds).setDepth(4);
                break;
            case 2:
                asteroid = new Asteroid(this.matter.world, x, y, 'rock2', null, this.wrapBounds).setDepth(4);
                break;
            default:
                asteroid = new Asteroid(this.matter.world, x, y, 'rock3', null, this.wrapBounds).setDepth(4);
        }

        asteroid.setCollisionCategory(this.asteroidsCollisionCategory);
        asteroid.setCollidesWith([this.asteroidsCollisionCategory, this.shipCollisionCategory, this.laserCollisionCategory]);
        this.asteroids.push(asteroid);
}

// Laser Class
class Laser extends Phaser.Physics.Matter.Sprite
{
    lifespan;

    constructor(world, x, y, texture, bodyOptions)
    {
        super(world, x, y, texture, null, { plugin: bodyOptions });

        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);

        this.scene.add.existing(this);

        this.world.remove(this.body, true);
    }

    fire(x, y, angle, speed)
    {
        this.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setRotation(angle);
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));

        this.lifespan = 300;
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        this.lifespan -= delta;

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
    }
}
// Custom Collision Resolution for When Laser Collides with rock
function laserVsRock(collisionData)
{
    const laser = collisionData.bodyA.gameObject;
    const rock = collisionData.bodyB.gameObject;

    laser.setActive(false);
    laser.setVisible(false);
    laser.world.remove(laser.body, true);

    rock.setActive(false);
    rock.setVisible(false);
    rock.world.remove(rock.body, true);
}

//config
const config = 
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    transparent: true,
    parent: 'game-container',
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            plugins: {
                wrap: true // plugin for world wrapping
            },
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [PhysicsExample]
};

const game = new Phaser.Game(config);
=======
class PhysicsExample extends Phaser.Scene 
{

    constructor() {
        super('mainscene');
        this.cursors;
        this.ship;
        this.laser;
        this.asteroid;
        this.asteroids = [];
        this.cometEmitter;
        this.boosterEmitter;
        this.particleConfig;
        this.asteroidsCollisionCategory;
        this.shipCollisionCategory;
        this.count;
        this.laserCollisionCategory;
        this.nextFire = 0;
        this.wrapBounds = {
            wrap: {
                min: { x:0, y:0},
                max: { x:800, y:600}
            }
        };
        this.cometConfig = {
            speed: 1000,
            lifespan: 1000,
            scale: {start: 0.2, end: 1},
            BlendMode: 'SCREEN', 
            frequency: 200,
            onEmit: function (particle, key, t, value) {
                this.frequencyCounter += t;
                this.depth = 3;
                this.desiredSpeed = this.speed;
                if (this.frequencyCounter >= this.frequency) {
                    this.particle.speed = desiredSpeed / Math.floor(Math.random() * 5000);
                    this.frequencyCounter = 0;
                } else {
                    return false;
                }
            },

            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Line (0, 0, 800, 600), quantity: 5
            }
        };
        // Booster Particle Config
        this.particleConfig = {
            speed: {
                onEmit: (particle, key, t, value) => this.ship.body.speed / 1,
            },
            lifespan: {
                onEmit: (particle, key, t, value) => Phaser.Math.Percent(this.ship.body.speed, 0, 100) * 4000
            },
            blendMode: 'SCREEN',
            emitZone: { type: 'line', source: new Phaser.Geom.Line(300, 300, 80, 80) },
            scale: { start: 0.001, end: 0.5 },

        };
    }

    preload()
    {
        this.load.image('ship', 'assets/ship.png');
        this.load.image('blue', 'assets/blue_particle.png');
        this.load.image('red', 'assets/red_particle.png');
        this.load.image('comet', 'assets/comet.png');
        this.load.image('bg', 'assets/background.png');
        this.load.image('rock1', 'assets/rock1.png');
        this.load.image('rock2', 'assets/rock2.png');
        this.load.image('rock3', 'assets/rock3.png');
        this.load.image('laser', 'assets/laser.png')
    }

    create() 
    {
        const space = this.add.image(0,0,'bg');
        space.setOrigin(0,0);
        space.setScale(0.6);
        space.alpha = 0.75;
        space.setDepth(0);

        this.asteroidsCollisionCategory = this.matter.world.nextCategory();
        this.laserCollisionCategory = this.matter.world.nextCategory();
        this.shipCollisionCategory = this.matter.world.nextCategory();

        this.ship = this.matter.add.image(400, 300, 'ship', null, {plugin: this.wrapBounds});
        this.ship.setFrictionAir(0.8);
        this.ship.setMass(400);
        this.ship.setScale(0.8);
        this.ship.setDepth(5);
        this.ship.setFixedRotation();
        this.ship.setCollisionCategory(this.shipCollisionCategory);
        this.boosterEmitter = this.add.particles(['red']).setDepth(4).createEmitter(this.particleConfig).startFollow(this.ship);
        this.cometEmitter = this.add.particles('comet').createEmitter(this.cometConfig).start();
        
        const generateAsteroids = this.time.addEvent ({
            delay: 2000,
            callback: createAsteroid,
            callbackScope: this,
            loop: true
        });

        // LASER handling
        this.lasers = [];
        for (let i = 0; i < 64; i++)
        {
            this.laser = new Laser(this.matter.world, -100, 100, 'laser', this.wrapBounds);
            this.laser.setCollisionCategory(this.laserCollisionCategory);
            this.laser.setCollidesWith([this.asteroidsCollisionCategory]);
            this.laser.setOnCollide(laserVsRock);
            this.lasers.push(this.laser);
        }
        this.cursors = this. input.keyboard.createCursorKeys();
    }

    update() 
    {
        //RGB comets
        this.cometEmitter.forEachAlive((particle, index) => {
            changeParticleColorAndSize(particle);
        });

        //ship movement
        if (this.cursors.left.isDown){
            this.ship.setAngularVelocity(-0.4);
       } else if (this.cursors.right.isDown){
            this.ship.setAngularVelocity(0.4);
        }
        // BOOST MODE!
        if (this.cursors.up.isDown && this.cursors.shift.isDown){
            this.ship.thrust(2.8);
        } else if (this.cursors.up.isDown){
            this.ship.thrust(2.2);
        }

        if (this.cursors.space.isDown){
            // Required for Implementing a fire rate.
            var firerate = 100;
            const laser = this.lasers.find(laser => !laser.active);
            if (laser && this.time.now > this.nextFire)
            {
                laser.fire(this.ship.x, this.ship.y, this.ship.rotation, 20);
                this.nextFire = this.time.now + firerate;
            }
        }
    }
}
// Insert Function and additional Classes Here

//make comets size and colour random
function changeParticleColorAndSize(particle) {
    const newColor = Phaser.Display.Color.RandomRGB();
    particle.tint = newColor.color;
    particle.scale = Math.random();
}

//asteroids

class Asteroid extends Phaser.Physics.Matter.Sprite
{
    constructor(world, x, y, texture, frame, bodyOptions)
    {
        super(world, x, y, texture, frame, { plugin: bodyOptions });
        this.setFrictionAir(0);
        this.scene.add.existing(this);
        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.FloatBetween(0.5, 4);
        const scale = Phaser.Math.FloatBetween(0.1, 0.2)
        this.setScale(scale);
        this.setMass(100 / scale * 2)
        this.setAngle(angle);
        this.setAngularVelocity(Phaser.Math.FloatBetween(-0.05, 0.05));
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);
    }
}
function createAsteroid()
    {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        let asteroid;

        switch (Math.floor(Math.random() * (3 - 0 + 1) + 1))
        {
            case 1:
                asteroid = new Asteroid(this.matter.world, x, y, 'rock1', null, this.wrapBounds).setDepth(4);
                break;
            case 2:
                asteroid = new Asteroid(this.matter.world, x, y, 'rock2', null, this.wrapBounds).setDepth(4);
                break;
            default:
                asteroid = new Asteroid(this.matter.world, x, y, 'rock3', null, this.wrapBounds).setDepth(4);
        }

        asteroid.setCollisionCategory(this.asteroidsCollisionCategory);
        asteroid.setCollidesWith([this.asteroidsCollisionCategory, this.shipCollisionCategory, this.laserCollisionCategory]);
        this.asteroids.push(asteroid);
}

// Laser Class
class Laser extends Phaser.Physics.Matter.Sprite
{
    lifespan;

    constructor(world, x, y, texture, bodyOptions)
    {
        super(world, x, y, texture, null, { plugin: bodyOptions });

        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);

        this.scene.add.existing(this);

        this.world.remove(this.body, true);
    }

    fire(x, y, angle, speed)
    {
        this.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setRotation(angle);
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));

        this.lifespan = 300;
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        this.lifespan -= delta;

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
    }
}
// Custom Collision Resolution for When Laser Collides with rock
function laserVsRock(collisionData)
{
    const laser = collisionData.bodyA.gameObject;
    const rock = collisionData.bodyB.gameObject;

    laser.setActive(false);
    laser.setVisible(false);
    laser.world.remove(laser.body, true);

    rock.setActive(false);
    rock.setVisible(false);
    rock.world.remove(rock.body, true);
}

//config
const config = 
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    transparent: true,
    parent: 'game-container',
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            plugins: {
                wrap: true // plugin for world wrapping
            },
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [PhysicsExample]
};

const game = new Phaser.Game(config);
>>>>>>> 4df1b3d58d5d304c4416dd7fcddade92a243ba54
