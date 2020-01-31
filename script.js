(function () {
    //canvas
    const canvas = document.getElementById("game-canvas");
    const playBtn = document.getElementById("play-btn");
    const ctx = canvas.getContext('2d');
    const height = 450;
    const width = 800;
    const scoreboard = document.getElementById("score");
    let score = 0;
    let gameRunning = true;

    //live objects values
    const playerMaxX = 20;
    const baseEnemyX = width;
    let enemies = [{x: baseEnemyX, y: 40}];
    let playerCurrY = 0;
    const playerCurrX = 60;
    let playerFrame = 0;
    let groundShift = 0;
    let speed = 1;
    let playerAnimationCounter = 0;

    let inJump = false;
    let jumpUp = true;

    //decorations
    let skyEnv = [{w: width - 100, h: 12}];
    let groundEnv = []; // TODO

    function sprite(name) {
        return document.getElementById(name);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function randomCloud() {
        if(getRandomInt(100) < 25) {
            skyEnv.push({w: width - 100, h: getRandomInt(50)})
        }
    }

    function randomEnemy() {
        if(enemies.length == 0) {
            eQuantity = getRandomInt(5);
            for(let i = 0; i < eQuantity; i++) {
                enemies.push({x: baseEnemyX + (i * (getRandomInt(width) + 200)), y: 40});
            }
        }
    }

    function play() {
        document.getElementById('menu').classList.toggle('sprites');
        score = 0;
        gameRunning = true;
        window.requestAnimationFrame(loop);
        canvas.onclick = () => {
            if(!inJump) {
                inJump = true;
            }
        };
    }
    
    function makeFrame(playerY = 0, playerX = 0, groundShift = 0) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0,0 , width, height);
        for (let i = 0; i < 800 + groundShift; i += 126) { // 126 == ground sprite width
            ctx.drawImage(sprite('sGround'), i - groundShift, height - 100);
        }
        skyEnv.forEach(i => {
            ctx.drawImage(sprite('sCloud'), 128 + (i.w--), i.h, 128, 128);
            skyEnv = skyEnv.filter(i => i.w + 256 > 0)
        });
        ctx.drawImage(sprite('sPlayer'),playerX, playerY, 46, 50, playerCurrX, height - 192 - playerCurrY, 92, 100);
        enemies.forEach(i => {
            ctx.drawImage(sprite('sEnm1'), i.x--, height - 135);
            enemies = enemies.filter(i => i.x + 100 > 0)
        })
    }

    function tick() {
        makeFrame(150,  46 * playerFrame, groundShift++);
        tickPostprocessing();
        score += speed;
        scoreboard.innerText = score;
    }

    function tickPostprocessing() {
        if(playerFrame > 7) {
            playerFrame = 0;
        }
        if(groundShift > 125) {
            groundShift = 0;
        }
        if(score % Math.pow(10, speed) == 0) {
            speed++;
        }
        inJump && processJump();
        processEnemy();
        randomEnemy();
    }
    
    function processEnemy() {
        enemies.forEach(i => {
            if(i.x <= playerCurrX + 60 && i.x >= playerCurrX && i.y > playerCurrY) {
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
        enemies = [];
        skyEnv = [];
        groundEnv = [];
        inJump = false;
        playerCurrY = 0;
        speed = 1;
        gameRunning = false;
    }

    function animationProcessing() {
        playerAnimationCounter++;
        if(playerAnimationCounter > 3) {
            playerAnimationCounter = 0;
            playerFrame++;
        }
    }
    
    function decorationsGenerator() {
        getRandomInt(100) < 5 && randomCloud();
    }

    function processJump() {
        playerCurrY += jumpUp ? 1 : -1;
        if(playerCurrY > 120 && jumpUp) {
            jumpUp = false;
        }
        if(playerCurrY <= 0 && !jumpUp) {
            jumpUp = true;
            inJump = false;
        }
    }

    //game
    canvas.height = height;
    canvas.width = width;
    ctx.imageSmoothingEnabled= false;

    function loop() {
        for (let i = 0; i < speed; i++) {
            tick();
        }
        animationProcessing();
        gameRunning && window.requestAnimationFrame(loop);
    }

    makeFrame();
    playBtn.onclick = play;

})();
