document.addEventListener("DOMContentLoaded", function () {
    //constants
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    var score = 0;
    var isGameStarted = false;
    var isGameOver = false;

    const balloonImage = new Image();
    balloonImage.src = "assets/red-balloon.png";
    const balloons = [];

    const crosshair = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 30,
        height: 30,
        draw() {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.beginPath();

            //new code here
            ctx.moveTo(this.x, this.y - this.height / 2);
            ctx.lineTo(this.x, this.y, + this.height / 2);
            ctx.moveTo(this.x - this.width / 2, this.y);
            ctx.lineTo(this.x + this.width / 2, this.y);
            ctx.stroke()

            //new code ended
        }
    };

    class Balloon {
        //editing THIS to make random colour balloons.
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.radius = 20;
            this.speed = Math.random() * 2 + 1;

            //new code here!
            //creating an array to store the new balloon images.
            const balloonImages = [
                "assets/red-balloon.png",
                "assets/pink-balloon.png",
                "assets/blue-balloon.png",
                "assets/yellow-balloon.png"
            ];

            //now to randomly select an image from this array.
            //this helped a lot. https://stackoverflow.com/questions/14004318/show-random-image-from-array-in-javascript

            const getRandomBalloon = Math.floor(Math.random() * balloonImages.length); //floor makes it a whole number, random picks a random number that corresponds to an item in the array.
            this.image = new Image();
            //makes the source correspond to an item in the array.
            this.image.src = balloonImages[getRandomBalloon];
        }
        update() {
            this.y -= this.speed;
        }
    
        draw() {
            ctx.drawImage(
                this.image,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 3
            );
        }
    }

    canvas.addEventListener("mousemove", function (event) {
        crosshair.x = event.clientX - canvas.getBoundingClientRect().left;
        crosshair.y = event.clientY - canvas.getBoundingClientRect().top;
    });

    canvas.addEventListener("click", function () {
        if (isGameOver) return;
        for (let i = balloons.length - 1; i>=0; i--) {
            const balloon = balloons[i];
            const dx = balloon.x - crosshair.x;
            const dy = balloon.y - crosshair.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balloon.radius * 1.8){
                balloons.splice(i, 1);
                score++;
            }
        }
    })

    drawStartScreen()

    //event listeners here
    
    //gameloop code
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!isGameOver) {
            balloons.forEach(balloon => {
                balloon.update();
                balloon.draw();
                //did the balloon reach the top? if so, take away score.
                if (balloon.y < 0) {
                    balloons.splice(balloons.indexOf(balloon), 1);
                    score --;
                }
            });

            crosshair.draw();

            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText(`Score: ${score}`, 20, 30);

            //game over conditions below!
            if (score >= 10) {
                isGameOver = true;
                drawEndText("Well done!");
            } else if (score <= -10) {
                isGameOver = true;
                drawEndText("Game Over :[");
            }

            if(!isGameOver) {
                //freezeframes on end screen.
                requestAnimationFrame(gameLoop);
            }
        }
        //this controls when the balloons spawn in.
        setInterval (() => {
            if (!isGameOver) {
                const balloon = new Balloon();
                balloons.push(balloon);
            }
            //this number effects the spawn rate. i believe 1000 is a second.
            //1000 spawned in a significantly large amount of balloons, so I've raised it to 5000.
            //it still seems to create a lot of balloons, but at least it doesn't lag out the computer.
        }, 5000);
    }
    //start scene
    function drawStartScreen() {

        ctx.clearRect(0,0, canvas.width, canvas.height);

        //new gradient here
        //code from https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
        const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
        gradient.addColorStop(0, "lightgreen")
        gradient.addColorStop(1, "green")
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //unmodified code below
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        const instruction = "Shoot as many balloons as you can.";
        const instructionWidth = ctx.measureText(instruction).width;
        const instructionxPosition = (canvas.width - instructionWidth) / 2;
        ctx.fillText(instruction, instructionxPosition, canvas.height / 2 - 20);

        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        const startButtonPrompt = "Click the start button to begin!";
        const StartButtonPromptWidth = ctx.measureText(startButtonPrompt).width;
        const promptxPosition = (canvas.width - StartButtonPromptWidth) / 2;
        ctx.fillText(startButtonPrompt, promptxPosition, canvas.height / 2 + 20);

        const startButtonWidth = 150;
        const startButtonHeight = 50;
        const startButtonX = (canvas.width - startButtonWidth) / 2;
        const StartButtonY = canvas.height / 2 + 50;

        ctx.fillStyle = "green";
        ctx.fillRect(startButtonX, StartButtonY, startButtonWidth, startButtonHeight);

        ctx.fillStyle = "white"
        ctx.font = "20px Arial";
        const buttonText = "Start";
        const buttonTextWidth = ctx.measureText(buttonText).width;
        const buttonTextXPosition = startButtonX + (startButtonWidth - buttonTextWidth) / 2;
        const buttonTextYPosition = StartButtonY + startButtonHeight / 2 + 7;
        ctx.fillText(buttonText, buttonTextXPosition, buttonTextYPosition)
    
        canvas.addEventListener ("click", function handleStartClick(event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            //condition for if the start button was clicked!
            if (
                mouseX >= startButtonX &&
                mouseX <= startButtonX + startButtonWidth &&
                mouseY >= StartButtonY &&
                mouseY < StartButtonY + startButtonHeight
            ) {
                canvas.removeEventListener("click", handleStartClick);
                isGameStarted = true;
                gameLoop();
            }
        });
    }
    //game scene
    
    //end scene
    function drawEndText(text) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(text, canvas.width / 2 - 80, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Click the Left Mouse Button to Restart!", canvas.width / 2 - 160, canvas.height / 2 + 30);
    
        canvas.addEventListener("click", function handleRestartClick () {
            restartGame();
            canvas.removeEventListener("click", handleRestartClick);
            gameLoop();
        });
    }
    //misc
    function restartGame (){
        balloons.length = 0;
        score = 0;
        isGameOver = false;
    }
    
});