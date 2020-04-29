"use strict";
/*
* Code for University of Strathclyde Mobile App Development.
* Developed by Nathan Goutcher 2020.
*
* Code confidential to developer and course examiners.
*
* This file should contain more maths for controller functions but ran out of time to split it up.
*/
function BreakoutModel() {
    this.randomBallDx = function (lb, ub) {
        let val = lb + Math.floor(Math.random() * (ub - lb + 1));
        if (val < 0)
            return val-1;
        else
            return val+1;
    };

    this.detectPaddleCollision = function (ballX, ballDx, ballY, ballDy, ballR, paddleX, paddleY, paddleW) {
        return (ballY + ballDy + ballR >= paddleY) && (ballX + ballDx - ballR >= paddleX && ballX + ballDx + ballR <= paddleX + paddleW);
    };
}
