document.addEventListener("DOMContentLoaded", function (){
    
    //Constants & variables that need to be loaded at the start
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
        //canvas dimensions here
        canvas.width = 800;
        canvas.height = 600;
    //variables
    var score = 0;
    var isGameOver = false;
    var isGameStarted = false;
    
    const balloonImage = document.createElement('img');
    img.src = 'applications/tutorials/week01/assets/red-balloon.png'
    const balloons = [];

    //crosshair
    const crosshair = {
        x: canvas.width / 2,
        y: canvas.width / 2,
        width: 30,
        height: 30,
        draw() {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.moveTo (this.x, this.y - this.height / 2);
            ctx.lineTo (this.x, this.y + this.height / 2);
            ctx.moveTo (this.x - this.width / 2, this.y);
            ctx.lineTo (this.x + this.width / 2, this.y);
            ctx.stroke();
        }
    };

    class Balloon {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.radius = 20;
            this.speed = Math.random() * 2 + 1;
        }
    

        update() {
            this.y -= this.speed;
        }

        draw() {
            ctx.drawImage(
                balloonImage,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 3
            );
        }
    }
    // mouse tracking

    canvas.addEventListener("mousemove", function (event){
        crosshair.x = event.clientX - canvas.getBoundingClientRect().left;
        crosshair.y = event.clientY - canvas.getBoundingClientRect().top;
    });

    //start scene

    //game scene

    //end scene

    //misc

    drawStartScreen();

});