const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;
const cw = canvas.width;
const ch = canvas.height;
let ballX = cw/2;
let ballY = ch/2;
let gameState = "menu";


let dy = (innerHeight-ch)/2;
let dx = (innerWidth-cw)/2;

const paddleHeight = 100;
const paddleWidth = 20;

let score = {
    player: 0,
    ai: 0,
}

let mouse = {
    x: (canvas.width - paddleWidth)/2,
    y: (canvas.height - paddleHeight)/2,
}

addEventListener('mousemove', function(event){
    mouse.x = Math.floor(event.x - dx);
    mouse.y = event.y - dy;
})

addEventListener('resize', function(){
    dy = (innerHeight-ch)/2;
    dx = (innerWidth-cw)/2;
})



const playerOX = 70;
const aiOX = cw-playerOX-paddleWidth;


let aiOY= 200;

let choice = [-4, 4];

let ballSpeedX = choice[Number(Math.random().toFixed(0))];
let ballSpeedY = choice[Number(Math.random().toFixed(0))];

let playerOY = mouse.y - paddleHeight/2;

function player(){
    playerOY = mouse.y - paddleHeight/2;
    ctx.fillStyle="#7FFF00";

    if(playerOY < 0)
        playerOY = 0;
    if(playerOY > ch-paddleHeight)
        playerOY = ch-paddleHeight;

    ctx.fillRect(playerOX - paddleWidth/2, playerOY, paddleWidth, paddleHeight);
}
let closeMs = 14, farMs = 7, playerHalfMs = 4;
function ai(){
    ctx.fillStyle="yellow";
    ctx.fillRect(aiOX, aiOY, paddleWidth, paddleHeight);

    aiPosition(closeMs, farMs, playerHalfMs);
}
function table(){
    //stół
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,cw,ch);
    //siatka ->linie na środku
    const lineHeight = 20;
    const lineWidth = 5;
    ctx.fillStyle = 'gray';
    for(let linePosition=0; linePosition<ch; linePosition+=lineHeight+10)
    {
        ctx.fillRect((cw-lineWidth)/2,linePosition,lineWidth,lineHeight);
    }
}

function ball(){
    const radius = 10;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "red";
    ctx.arc(ballX, ballY, radius, 0, Math.PI*2, false);
    ctx.fill();
    ctx.stroke();

    //kontakt z bocznymi ścianami
    if(ballY + radius > ch || ballY - radius < 0){
        ballSpeedY = -ballSpeedY;
        speedUp();
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //kontakt z liniami końcowymi -> OX
    if(ballX + radius > cw){
        ballSpeedX = -ballSpeedX;
        score.player++;
        restart();
    }
    else if(ballX - radius <= 0){
        ballSpeedX = -ballSpeedX;
        score.ai++;
        restart();
    }

    //kontakt z paletką gracza
    if((ballX > playerOX) &&(ballX < playerOX + paddleWidth) && (ballY - radius <= playerOY + paddleHeight) && (ballY + radius >= playerOY)){
        //ballX = 90;
        ballSpeedX = -ballSpeedX;
    }
    //kontakt z paletką ai
    if((ballX > aiOX) &&(ballX < aiOX + paddleWidth) && (ballY - radius <= aiOY + paddleHeight) && (ballY + radius >= aiOY)){
        //ballX = 90;
        ballSpeedX = -ballSpeedX;
    }
}
function speedUp(){

    //speed OX
    if(ballSpeedX > 0 && ballSpeedX < 17){
        ballSpeedX += 0.4;
    }
    else if(ballSpeedX > -17 && ballSpeedX < 0){
        ballSpeedX -= 0.4;
    }
    //speed OY
    if(ballSpeedY > 0 && ballSpeedY < 17){
        ballSpeedY += 0.3;
    }
    else if(ballSpeedY > -17 && ballSpeedY < 0){
        ballSpeedY -= 0.3;
    }

}

function aiPosition(closeMs, farMs, playerHalfMs){
    const midPaddle = aiOY + paddleHeight/2;
    const midBall = ballY;
    const diff= midPaddle - midBall;

    if(ballX > 500){
        if(diff > 200){
            aiOY -= closeMs;
        }
        else if (diff > 50){
            aiOY -= farMs;
        }
        else if (diff < -200){
            aiOY += closeMs;
        }
        else if (diff < -50){
            aiOY += farMs;
        }
    }
    else if(ballX <= 500 && ballX > 150){
        if(diff > 100){
            aiOY -= playerHalfMs;
        }
        else if (diff < -100){
            aiOY += playerHalfMs;
        }
    }
}

function restart(){
    ballSpeedX = choice[Number(Math.random().toFixed(0))];
    ballSpeedY = choice[Number(Math.random().toFixed(0))];
    ballX = cw/2;
    ballY = ch/2;
}

function showScore(){
    document.getElementById("player").innerHTML=score.player;
    document.getElementById("ai").innerHTML=score.ai;
}

function Button(text, x, y, w, h){
    ctx.beginPath();
    ctx.strokeStyle= "white";
    ctx.strokeRect(x - w, y - h, w*2, h*2);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "red";
    ctx.fillText(text, x - 30, y + 10);
    ctx.closePath();
    ctx.stroke();
}

function menu(){

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,cw,ch);


    ctx.fill();
    const playBtn = new Button("Play", cw/2, ch/2, 75, 25);
    const menuBtn = new Button("Menu", cw/2, ch/2 + 60, 75, 25);
    addEventListener('click', function(){
        if((gameState == "menu")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25 && mouse.y<= ch/2+25)){

            setInterval(playGame, 100/6);
        }
        else if((gameState == "menu")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25+60 && mouse.y<= ch/2+25+60)){
            gameState = "settings";
            settings();
        }
    })

}

function settings(){
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,cw,ch);
    ctx.fill();

    const aiS = new Button("AI", cw/2, ch/2, 75, 25);
    //const matchS = new Button("Match Settings", cw/2, ch/2 + 60, 75, 25);
    const back = new Button("Back", cw/2, ch/2 + 120, 75, 25);

    addEventListener('click', function(){
        if((gameState == "settings")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25 && mouse.y<= ch/2+25)){
            gameState = "aiSet";
            aiSet();
        }
        else if((gameState == "settings")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25+60 && mouse.y<= ch/2+25+60)){


        }
        else if((gameState == "settings")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25+120 && mouse.y<= ch/2+25+120)){
            gameState = "menu";
            menu();
        }
    })
}

function aiSet(){
    //easy
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,cw,ch);
    ctx.fill();

    const easy = new Button("Easy", cw/2, ch/2, 75, 25);
    const med = new Button("Medium", cw/2, ch/2 + 60, 75, 25);
    const hard = new Button("Hard", cw/2, ch/2 + 120, 75, 25);

    addEventListener('click', function(){
        if((gameState == "aiSet")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25 && mouse.y<= ch/2+25)){

            closeMs = 7;
            farMs= 3;
            playerHalfMs= 2;
            gameState = "settings";
            settings();
        }
        else if((gameState == "aiSet")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25+60 && mouse.y<= ch/2+25+60)){

            closeMs = 14;
            farMs= 6;
            playerHalfMs= 4;
            gameState = "settings";
            settings();
        }
        else if((gameState == "aiSet")&&(mouse.x>=cw/2-75 && mouse.x<= cw/2+75 && mouse.y>=ch/2-25+120 && mouse.y<= ch/2+25+120)){
            closeMs = 17;
            farMs= 9;
            playerHalfMs= 6;
            gameState = "settings";
            settings();
        }
    })
}


function playGame(){
    //document.getElementsByTagName("canvas").style.cursor = "none";
    table();
    ball();
    player();
    ai();
    showScore();


}
menu();


