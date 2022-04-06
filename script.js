let KEY_SPACE = false; // 32
let KEY_UP = false; // 38
let KEY_DOWN = false; // 40

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreContainer = document.getElementById("scoreContainer");

let backgroundImage = new Image();

let rocket = {
    x: 50,
    y: 200,
    width: 100,
    height: 50,
    speed: 7,
    src: 'img/rocket.png'
};

let ufos = [];
let lasers = [];
let ufoDelay = 5000;
let score = 0;

let canShoot = true;

const startGame = () => {

    loadImages();

    setKeyListeners();

    setInterval(update, 1000 / 25);
    setInterval(createUfos, ufoDelay);
    setInterval(checkForCollision, 1000 / 25);
    setInterval(() => {
        if (ufoDelay > 3000) {
            ufoDelay -= 500;
        }
    }, 10000)

    draw();

};

const setKeyListeners = () => {

    document.onkeydown = e => {
        if (e.keyCode == 32) {
            KEY_SPACE = true;
        }
    
        if (e.keyCode == 38) {
            KEY_UP = true;
        }
    
        if (e.keyCode == 40) {
            KEY_DOWN = true;
        }
    }
    
    document.onkeyup = e => {
        if (e.keyCode == 32) {
            KEY_SPACE = false;
        }
    
        if (e.keyCode == 38) {
            KEY_UP = false;
        }
    
        if (e.keyCode == 40) {
            KEY_DOWN = false;
        }
    }

}

const checkForCollision = () => {
    ufos.forEach(ufo => {
        if (rocket.x < ufo.x + ufo.width &&
            rocket.x + rocket.width > ufo.x &&
            rocket.y < ufo.y + ufo.height &&
            rocket.height + rocket.y > ufo.y
        ){
            rocket.img.src = "img/boom.png";
            rocket.speed = 0;
            canShoot = false;
            ufos = ufos.filter(u => u != ufo);
            const boomAudio = new Audio('audio/boom.mp3');
            boomAudio.volume = 0.2;
            boomAudio.play();
            setTimeout(() => {
                location.reload();
            }, 1000);
            
        };

        lasers.forEach(laser => {
            if (laser.x < ufo.x + ufo.width &&
                laser.x + laser.width > ufo.x &&
                laser.y < ufo.y + ufo.height &&
                laser.height + laser.y > ufo.y &&
                ufo.destroyed == false
            ){
                ufo.img.src = "img/boom.png";
                ufo.destroyed = true;
                ufo.speed = 0;
                score += 10;
                const boomAudio = new Audio('audio/boom.mp3');
                boomAudio.volume = 0.2;
                boomAudio.play();
                setTimeout(() => {
                    ufos = ufos.filter(u => u != ufo);
                }, 250);
            };

            
        })
    });
};

const loadImages = () => {
    backgroundImage.src = "img/background.jpg";

    rocket.img = new Image();
    rocket.img.src = rocket.src;
};

const draw = () => {

    ctx.drawImage(backgroundImage, 0, 0);
    ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

    ufos.forEach((ufo) => {
        ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
    });

    lasers.forEach((laser) => {
        ctx.drawImage(laser.img, laser.x, laser.y, laser.width, laser.height);
    });

    requestAnimationFrame(draw);
};

const update = () => {
    if (KEY_UP && rocket.y > 10) {
        rocket.y -= rocket.speed;
    }

    if (KEY_DOWN && rocket.y < 420) {
        rocket.y += rocket.speed;
    }

    if (KEY_SPACE && canShoot) {
        canShoot = false;
        createLaser();

        // 0.75 Second cooldown
        setTimeout(() => {
            canShoot = true;
        }, 750);
    }

    ufos.forEach((ufo) => {
        ufo.x -= ufo.speed;

        if (ufo.x < -100) {
            // Restart game
            location.reload();
        }
    });

    lasers.forEach((laser) => {
        laser.x += 20;

        if (laser.x > 800) {
            //Delete laser if offscreen
            lasers = lasers.filter(l => l != laser)
        }
    });    

    scoreContainer.innerText = `Score: ${score}`;
};

const createUfos = () => {
    const ufo = {
        x: 800,
        y: Math.floor(Math.random() * 420 + 40),
        width: 100,
        height: 40,
        speed: Math.floor(Math.random() * 10 + 5),
        destroyed: false,
        src: 'img/ufo.png',
        img: new Image()
    };
    ufo.img.src = ufo.src;
    ufos.push(ufo);
};

const createLaser = () => {
    const laser = {
        x: rocket.x + rocket.width - 10,
        y: rocket.y + rocket.height / 2 - 5,
        width: 30,
        height: 10,
        src: 'img/laser.png',
        img: new Image()
    };

    laser.img.src = laser.src;
    lasers.push(laser);
    const laserAudio = new Audio('audio/shoot.mp3');
    laserAudio.volume = 0.2;
    laserAudio.play();
};