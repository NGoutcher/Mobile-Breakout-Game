"use strict";
/*
* Code for University of Strathclyde Mobile App Development.
* Developed by Nathan Goutcher 2020.
*
* Code confidential to developer and course examiners.
*
* Main controller file, game physics mostly handled here.
* BALL STARTS SLOW AND GETS FASTER UNTIL A SPEED OF DX = -4.5/4.5, DY = -4.5/4.5
*/

let breakoutView = new BreakoutView(),
    breakoutModel = new BreakoutModel(),
    breakoutController = null;

function BreakoutController() {
    let canvas = breakoutView.getCanvas();
    let c = canvas.getContext('2d');
    let button_pressable = false;

    this.init = function () {
        button_pressable = true;
        breakoutView.setCanvasDimensions(window.innerWidth, window.innerHeight);

        breakoutView.drawHeader(c);
        breakoutView.drawFooter(c);

        let eButton = new breakoutView.enableButton(c, breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight()/3);
        eButton.draw();
        let startButton = new breakoutView.playButton(c, breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight()/1.5);
        startButton.draw();

        canvas.addEventListener('click', function(event) {
            if(button_pressable) {
                if (event.x > (eButton.getX()) && event.x < (eButton.getX() / 2) + eButton.getW() &&
                    event.y > eButton.getY() && event.y < eButton.getY() + eButton.getH()) {
                    if (window.DeviceOrientationEvent) {
                        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                            DeviceOrientationEvent.requestPermission();
                        }
                    }
                }

                if (event.x > (startButton.getX()) && event.x < (startButton.getX()) + startButton.getW() &&
                    event.y > startButton.getY() && event.y < startButton.getY() + startButton.getH()) {
                    let event = new Event('start');
                    addEventListener('start', breakoutController.start);
                    dispatchEvent(event);
                }
            }
        });

    };

    this.start = function () {
        button_pressable = false;
        let over = false;
        breakoutView.clearCanvas(c);

        function Ball(x, y, dx, dy, radius) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;

            this.draw = function (){
                breakoutView.drawBall(c, this.x, this.y, this.radius);
            };

            this.update = function () {
                if(breakoutModel.detectPaddleCollision(this.x, this.dx, this.y, this.dy, this.radius, paddle.x, paddle.y, paddle.width))
                    this.dy = -this.dy;

                if(this.x + this.radius > breakoutView.getCanvasWidth() || this.x - this.radius < 0) {
                    this.dx = -this.dx;
                }

                if(this.y + this.radius > breakoutView.getCanvasHeight() || this.y - this.radius < 0) {
                    this.dy = -this.dy;
                }

                if(this.y + this.radius + this.dy >= (paddle.height/2) + paddle.y) {
                    over = true;
                    blocksArr = [];
                    breakoutView.clearCanvas(c);
                    let event = new Event('end');
                    addEventListener('end', breakoutController.end);
                    dispatchEvent(event);
                    return;
                } else {
                    this.x += this.dx;
                    this.y += this.dy;
                }

                this.draw();
            };
        }

        function Paddle(x, y, width, height) {
            this.x = x - (width/2);
            this.y = y;
            this.width = width;
            this.height = height;

            this.draw = function () {
                breakoutView.drawPaddle(c, this.x, this.y, this.width, this.height);
            };

            this.update = function (dx) {
                this.potentialX = this.x + dx;
                if(this.potentialX > 0 && this.potentialX + this.width < breakoutView.getCanvasWidth()) {
                    this.x = this.potentialX;
                } else if(this.potentialX + this.width >= breakoutView.getCanvasWidth()) {
                    this.x = breakoutView.getCanvasWidth() - this.width;
                } else if (this.potentialX <= 0) {
                    this.x = 0;
                }

                this.draw();
            };
        }

        function Block(x, y, width, height, colour) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.destroyed = false;
            this.colour = colour;

            this.draw = function () {
                breakoutView.drawBlock(c, this.x, this.y, this.width, this.height, this.colour);
            };

            this.update = function () {
                if(!this.destroyed && (ball.y + ball.dy + ball.radius >= this.y && ball.y + ball.dy + ball.radius <= this.y + this.height)
                    && ((ball.x + ball.dx - ball.radius >= this.x && ball.x + ball.dx - ball.radius <= this.x + this.width)
                    || (ball.x + ball.dx + ball.radius >= this.x && ball.x + ball.dx + ball.radius <= this.x + this.width))) {

                    let poc = [ball.x + ball.dx - ball.radius, ball.y - ball.radius];

                    if(poc[1] <= this.y) {
                        ball.dy = -(ball.dy);
                    } else {
                        ball.dx = -(ball.dx);
                    }
                    this.destroyed = true;

                    if((ball.dx >= -4.5 && ball.dx <= 4.5) && (ball.dy >= -4.5 && ball.dy <= 4.5)) {
                        ball.dx *= 1.5;
                        ball.dy *= 1.5;
                    }
                } else if (!this.destroyed && (ball.x + ball.dx - ball.radius >= this.x && ball.x + ball.dx - ball.radius <= this.x + this.width)
                    && (ball.y + ball.dy - ball.radius >= this.y && ball.y + ball.dy - ball.radius <= this.y + this.height)) {

                    let poc = [ball.x + ball.dx - ball.radius, ball.y - ball.radius];
                    let totaly = (this.y + this.height);

                    if(poc[1] <= totaly) {
                        ball.dx = -(ball.dx);
                    } else {
                        ball.dy = -(ball.dy);
                    }
                    this.destroyed = true;

                    if((ball.dx >= -4.5 && ball.dx <= 4.5) && (ball.dy >= -4.5 && ball.dy <= 4.5)) {
                        ball.dx *= 1.5;
                        ball.dy *= 1.5;
                    }
                } else if(!this.destroyed && (ball.x + ball.dx + ball.radius >= this.x && ball.x + ball.dx + ball.radius <= this.x + this.width)
                    && (ball.y + ball.dy - ball.radius >= this.y && ball.y + ball.dy - ball.radius <= this.y + this.height)) {

                    let poc = [ball.x + ball.dx + ball.radius, ball.y - ball.radius];
                    let totalx = (this.x + this.width), totaly = (this.y + this.height);

                    if(poc[1] <= totaly) {
                        ball.dx = -(ball.dx);
                    } else {
                        ball.dy = -(ball.dy);
                    }
                    this.destroyed = true;

                    if((ball.dx >= -4.5 && ball.dx <= 4.5) && (ball.dy >= -4.5 && ball.dy <= 4.5)) {
                        ball.dx *= 1.5;
                        ball.dy *= 1.5;
                    }
                }

                if(!this.destroyed) {
                    this.draw();
                }
            }
        }

        function createBlocks(columns, rows, blockColours) {
            let size = (breakoutView.getCanvasWidth()/columns) - 3;
            let blocks = [];
            let y = 5;
            for (let i = 0; i < rows; i++) {
                blocks[i] = new Array(columns);
                let row = blocks[i];
                for(let j = 0; j < row.length; j++) {
                    if (j === 0) {
                        row[j] = new Block(5, y, size, size, blockColours[i]);
                    } else {
                        row[j] = new Block(row[j-1].x + size + 2, y, size, size, blockColours[i]);
                    }
                }
                y += size + 2;
            }
            return blocks;
        }

        let ball = new Ball(breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight() - 200, breakoutModel.randomBallDx(-1,1), 1, breakoutView.getCanvasWidth()/30);
        let paddle = new Paddle(breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight() - (breakoutView.getCanvasHeight()/20), breakoutView.getCanvasWidth()/3.5, breakoutView.getCanvasHeight()/54);
        let blockColours = ['green', 'blue', 'orange', 'red'];
        let blocksArr = createBlocks(9, 4, blockColours);

        function drawBlocks(blocks) {
            let row = [];
            for(let i = 0; i < blocks.length; i++) {
                row = blocks[i];
                for (let j = 0; j < row.length; j++) {
                    row[j].update();
                }
            }
        }

        function checkWon(blocks) {
            let won = true;
            let row = [];
            for(let i = 0; i < blocks.length; i++) {
                row = blocks[i];
                for (let j = 0; j < row.length; j++) {
                    if(row[j].destroyed === false) {
                        won = false;
                    }
                }
            }

            return won;
        }

        if(window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function (event) {
                let g = event.gamma;
                if(!over) {
                    paddle.update(g);
                }
            })
        }

        function canvasReset () {
            if(!checkWon(blocksArr)) {
                breakoutView.clearCanvas(c);
                paddle.draw();
                ball.update();
                drawBlocks(blocksArr);
            } else {
                over = true;
                let event = new Event('won');
                addEventListener('won', breakoutController.won);
                dispatchEvent(event);
            }
        }

        function animate() {
            if(!over) {
                requestAnimationFrame(animate);
                canvasReset();
            }
        }

        animate();
    };

    this.end = function () {
        button_pressable = true;

        breakoutView.drawHeader(c);
        breakoutView.drawLoss(c);
        breakoutView.drawFooter(c);

        let eButton = new breakoutView.enableButton(c, breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight()/3);
        eButton.draw();
        let startButton = new breakoutView.playButton(c, breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight()/1.5);
        startButton.draw();

        canvas.addEventListener('click', function(event) {
            if(button_pressable) {
                if (event.x > (eButton.getX()) && event.x < (eButton.getX() / 2) + eButton.getW() &&
                    event.y > eButton.getY() && event.y < eButton.getY() + eButton.getH()) {
                    if (window.DeviceOrientationEvent) {
                        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                            DeviceOrientationEvent.requestPermission();
                        }
                    }
                }

                if (event.x > (startButton.getX()) && event.x < (startButton.getX()) + startButton.getW() &&
                    event.y > startButton.getY() && event.y < startButton.getY() + startButton.getH()) {
                    let event = new Event('start');
                    addEventListener('start', breakoutController.start);
                    dispatchEvent(event);
                }
            }
        });
    };

    this.won = function () {
        button_pressable = true;

        breakoutView.drawHeader(c);
        breakoutView.drawWin(c);
        breakoutView.drawFooter(c);

        let eButton = new breakoutView.enableButton(c, breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight()/3);
        eButton.draw();
        let startButton = new breakoutView.playButton(c, breakoutView.getCanvasWidth()/2, breakoutView.getCanvasHeight()/1.5);
        startButton.draw();

        canvas.addEventListener('click', function(event) {
            if (button_pressable) {
                if (event.x > (eButton.getX()) && event.x < (eButton.getX() / 2) + eButton.getW() &&
                    event.y > eButton.getY() && event.y < eButton.getY() + eButton.getH()) {
                    if (window.DeviceOrientationEvent) {
                        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                            DeviceOrientationEvent.requestPermission();
                        }
                    }
                }

                if (event.x > (startButton.getX()) && event.x < (startButton.getX()) + startButton.getW() &&
                    event.y > startButton.getY() && event.y < startButton.getY() + startButton.getH()) {
                    let event = new Event('start');
                    addEventListener('start', breakoutController.start);
                    dispatchEvent(event);
                }
            }
        });
    }
}

breakoutController = new BreakoutController();
window.addEventListener("load", breakoutController.init);