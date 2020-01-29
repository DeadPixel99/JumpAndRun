(function () {
    //canvas
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext('2d');
    const height = 450;
    const width = 800;

    //live objects values
    const enemyMaxY = 30;
    const playerMaxX = 20;
    let enemyCurrX = 200;
    let playerCurrY = 0;
    let playerFrame = 0;
    let speed = 1;

    let skyEnv = [{w: width - 100, h: 12}];
    let groundEnv = []; // TODO

    function sprite(name) {
        return document.getElementById(name);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    function makeFrame() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0,0 , width, height);
        for (let i = 0; i < 800; i += 126) { // 126 == ground sprite width
            ctx.drawImage(sprite('sGround'), i, height - 100);
        }
        skyEnv.forEach(i => {
            ctx.drawImage(sprite('sCloud'), i.w-=speed, i.h, 128, 128);
            skyEnv = skyEnv.filter(i => i.w + 128 > 0)
        });
        ctx.drawImage(sprite('sPlayer'),0, 0, 46, 48, 0, height - 188, 73, 88);
    }

    function tick() {
        makeFrame();
    }

    //game
    canvas.height = height;
    canvas.width = width;
    ctx.imageSmoothingEnabled= false;

    makeFrame();
    setInterval(() => {
        tick();
    }, 33)

})();
