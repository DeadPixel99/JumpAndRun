//(function () {
    //canvas
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext('2d');
    const height = 450;
    const width = 800;
    const scoreboard = document.getElementById("score");
    let score = 0;
    let gameRunning = true;

    //live objects values
    const playerMaxX = 20;
    const baseEnemyX = width;
    let gameLoop = null;
    let enemies = [{x: baseEnemyX, y: 40}];
    let playerCurrY = 0;
    const playerCurrX = 60;
    let playerFrame = 0;
    let groundShift = 0;
    let speed = 10;
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
                enemies.push({x: baseEnemyX + (eQuantity * (getRandomInt(width)) + 100), y: 40});
            }
        }
    }
    
    function makeFrame(playerY = 0, playerX = 0, groundShift = 0) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0,0 , width, height);
        for (let i = 0; i < 800; i += 126) { // 126 == ground sprite width
            ctx.drawImage(sprite('sGround'), i - groundShift, height - 100);
        }
        skyEnv.forEach(i => {
            ctx.drawImage(sprite('sCloud'), 128 + (i.w-=speed), i.h, 128, 128);
            skyEnv = skyEnv.filter(i => i.w + 256 > 0)
        });
        ctx.drawImage(sprite('sPlayer'),playerX, playerY, 46, 50, playerCurrX, height - 192 - playerCurrY, 92, 100);
        enemies.forEach(i => {
            ctx.drawImage(sprite('sEnm1'), i.x-=speed, height - 135);
            enemies = enemies.filter(i => i.x + 100 > 0)
        })
    }

    function tick() {
        makeFrame(150,  46 * playerFrame, groundShift += speed);
        playerAnimationCounter++;
        tickPostprocessing();
        score += speed;
        scoreboard.innerText = score;
    }

    function tickPostprocessing() {
        if(playerAnimationCounter > 3) {
            playerAnimationCounter = 0;
            playerFrame++;
        }
        if(playerFrame > 7) {
            playerFrame = 0;
        }
        if(groundShift > 17) {
            groundShift = 0;
        }
        inJump && processJump();
        getRandomInt(100) < 5 && randomCloud();
        processEnemy();
        randomEnemy();
    }
    
    function processEnemy() {
        enemies.forEach(i => {
            if(i.x <= playerCurrX + 60 && i.x >= playerCurrX && i.y > playerCurrY) {
                alert('Game Over');
                enemies = [];
                gameRunning = false;
                makeFrame();
            }
        });
    }

    function processJump() {
        playerCurrY += jumpUp ? 3 : -3;
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

    canvas.onclick = () => {
        if(!inJump) {
            inJump = true;
        }
    };

    function loop() {
        tick();
        gameRunning && window.requestAnimationFrame(loop);
    }

    // TODO Change to requestAnimationFrame + speed == fps
    makeFrame();
    // gameLoop = setInterval(() => {
    //     tick();
    // }, 16);
    window.requestAnimationFrame(loop);

//})();
