(function () {
    const canvas = document.getElementById("game-canvas");
    const playBtn = document.getElementById("play-btn");
    const scoreboard = document.getElementById("score");

    const Game = {
        gameRunning: true,
        inJump: false,
        jumpUp: true,
        score: 0,
        speed: 1
    };

    const Graphics = {
        ctx: canvas.getContext('2d'),
        height: 450,
        width: 800
    };

    const Player = {
        maxX: 20,
        currY: 0,
        currX: 60,
        frame: 0,
        animationCounter: 0
    };

    const Env = {
        baseEnemyX: Graphics.width,
        enemies: [{x: this.baseEnemyX, y: 40}],
        skyDecor: [{w: Graphics.width - 100, h: 12}],
        groundDecor: [],
        groundShift: 0,
    };


    function sprite(name) {
        return document.getElementById(name);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function randomCloud() {
        if(getRandomInt(100) < 25) {
            Env.skyDecor.push({w: Graphics.width - 100, h: getRandomInt(50)})
        }
    }

    function randomEnemy() {
        if(Env.enemies.length === 0) {
            eQuantity = getRandomInt(5);
            for(let i = 0; i < eQuantity; i++) {
                Env.enemies.push({x: Env.baseEnemyX + (i * (getRandomInt(Graphics.width) + 200)), y: 40});
            }
        }
    }

    function play() {
        document.getElementById('menu').classList.toggle('sprites');
        Game.score = 0;
        Game.gameRunning = true;
        window.requestAnimationFrame(loop);
        canvas.onclick = () => {
            if(!Game.inJump) {
                Game.inJump = true;
            }
        };
    }
    
    function makeFrame(playerY = 0, playerX = 0, groundShift = 0) {
        Graphics.ctx.fillStyle = '#87CEEB';
        Graphics.ctx.fillRect(0,0 , Graphics.width, Graphics.height);
        for (let i = 0; i < 800 + groundShift; i += 126) { // 126 == ground sprite width
            Graphics.ctx.drawImage(sprite('sGround'), i - groundShift, Graphics.height - 100);
        }
        Env.skyDecor.forEach(i => {
            Graphics.ctx.drawImage(sprite('sCloud'), 128 + (i.w--), i.h, 128, 128);
            Env.skyDecor = Env.skyDecor.filter(i => i.w + 256 > 0)
        });
        Graphics.ctx.drawImage(sprite('sPlayer'),playerX, playerY, 46, 50, Player.currX, Graphics.height - 192 - Player.currY, 92, 100);
        Env.enemies.forEach(i => {
            Graphics.ctx.drawImage(sprite('sEnm1'), i.x--, Graphics.height - 135);
            Env.enemies = Env.enemies.filter(i => i.x + 100 > 0)
        })
    }

    function scrollIteration() {
        makeFrame(150,  46 * Player.frame, Env.groundShift++);
        scrollPostprocessing();
        Game.score += Game.speed;
        scoreboard.innerText = Game.score;
    }

    function scrollPostprocessing() {
        if(Player.frame > 7) {
            Player.frame = 0;
        }
        if(Env.groundShift > 125) {
            Env.groundShift = 0;
        }
        if(Game.score % Math.pow(10, Game.speed) === 0) {
            Game.speed++;
        }
        Game.inJump && processJump();
        processEnemy();
        randomEnemy();
    }
    
    function processEnemy() {
        Env.enemies.forEach(i => {
            if(i.x <= Player.currX + 60 && i.x >= Player.currX && i.y > Player.currY) {
                gameOver();
            }
        });
    }

    function gameOver() {
        alert('Game Over');
        gameCleanUp();
        makeFrame();
        document.getElementById('menu').classList.toggle('sprites');
    }

    function gameCleanUp() {
        canvas.onclick = null;
        Env.enemies = [];
        Env.skyDecor = [];
        Env.groundEnv = [];
        Game.inJump = false;
        Player.currY = 0;
        Game.speed = 1;
        Game.gameRunning = false;
    }

    function animationProcessing() {
        Player.animationCounter++;
        if(Player.animationCounter > 3) {
            Player.animationCounter = 0;
            Player.frame++;
        }
    }
    
    function decorationsGenerator() {
        getRandomInt(100) < 5 && randomCloud();
    }

    function processJump() {
        Player.currY += Game.jumpUp ? 1 : -1;
        if(Player.currY > 120 && Game.jumpUp) {
            Game.jumpUp = false;
        }
        if(Player.currY <= 0 && !Game.jumpUp) {
            Game.jumpUp = true;
            Game.inJump = false;
        }
    }

    function loop() {
        for (let i = 0; i < Game.speed; i++) {
            scrollIteration();
        }
        animationProcessing();
        decorationsGenerator();
        Game.gameRunning && window.requestAnimationFrame(loop);
    }

    //game
    canvas.height = Graphics.height;
    canvas.width = Graphics.width;
    Graphics.ctx.imageSmoothingEnabled= false;
    makeFrame();
    playBtn.onclick = play;

})();
