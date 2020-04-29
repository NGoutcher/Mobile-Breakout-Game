"use strict";
/*
* Code for University of Strathclyde Mobile App Development.
* Developed by Nathan Goutcher 2020.
*
* Code confidential to developer and course examiners.
*
* Handles drawing of elements onto the canvas
*/

function BreakoutView() {
    let canvas = document.getElementById("mainCanvas");

    this.getCanvas = function () {
        return canvas;
    };

    this.setCanvasDimensions = function(width, height) {
        canvas.width = width;
        canvas.height = height;
    };

    this.getCanvasWidth = function () {
        return canvas.width;
    };

    this.getCanvasHeight = function () {
        return canvas.height;
    };
    
    this.drawFooter = function (c) {
        c.fillStyle = "black";
        c.fillRect(0, canvas.height-50, canvas.width, 50);
        c.font = "15px Comic Sans MS";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("MADE BY NATHAN GOUTCHER", canvas.width/2, canvas.height-20);
    };

    this.drawHeader = function (c) {
        c.fillStyle = "black";
        c.fillRect(0, 0, breakoutView.getCanvasWidth(), breakoutView.getCanvasHeight());

        let logo = new Image();
        logo.onload = function () {
            c.fillStyle = 'black';
            c.fillRect(0, 0, canvas.width, canvas.height/8);
            c.drawImage(logo, (canvas.width/2) - (logo.width/3), 0, logo.width/1.5, logo.height/1.5);
        };
        logo.src = "logo.png";
    };

    this.enableButton = function (c, x, y) {
        let bx = x;
        let by = y;
        let bwidth = 0;
        let bheight = 0;

        this.draw = function () {
            let buttonimg = new Image();
            buttonimg.onload = function () {
                bwidth = canvas.width/1.5;
                bheight = canvas.height/10;
                bx -= bwidth/2;
                c.drawImage(buttonimg, bx, by, bwidth, bheight);
            };
            buttonimg.src = "button.png";
        };

        this.getX = function () {
            return bx;
        };

        this.getY = function () {
            return by;
        };

        this.getW = function () {
            return bwidth;
        };

        this.getH = function () {
            return bheight;
        }
    };

    this.playButton = function (c, x, y) {
        let px = x;
        let py = y;
        let width = 0;
        let height = 0;

        this.draw = function () {
            let playimg = new Image();
            playimg.onload = function () {
                width = canvas.width/2;
                height = canvas.height/10;
                px -= width/2;
                c.drawImage(playimg, px, py, width, height);
            };
            playimg.src = "playbutton.png";
        };

        this.getX = function () {
            return px;
        };

        this.getY = function () {
            return py;
        };

        this.getW = function () {
            return width;
        };

        this.getH = function () {
            return height;
        }
    };

    this.drawWin = function (c) {
        c.font = "40px Comic Sans MS";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("YOU WIN!", canvas.width/2, canvas.height/5);
    };

    this.drawLoss = function (c) {
        c.font = "40px Comic Sans MS";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("GAME OVER", canvas.width/2, canvas.height/5);
    };

    this.clearCanvas = function (c) {
        c.clearRect(0,0, innerWidth, innerHeight);
    };

    this.drawBall = function (c, x, y, r) {
        c.beginPath();
        c.arc(x, y, r, 0, Math.PI * 2);
        c.strokeStyle = 'black';
        c.stroke();
        c.fillStyle = 'black';
        c.fill();
    };
    
    this.drawPaddle = function (c, x, y, width, height) {
        c.beginPath();
        c.fillStyle = 'black';
        c.fillRect(x, y, width, height);
    };

    this.drawBlock = function (c, x, y, width, height, colour) {
        c.beginPath();
        c.fillStyle = colour;
        c.fillRect(x, y, width, height);
    }
}
