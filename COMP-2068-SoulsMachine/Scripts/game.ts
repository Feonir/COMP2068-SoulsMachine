/*
*Source File Name : SlotMachineDemo
*Author Name / Last Modified By: Robert Berry
*This program is a slot machine with a Darksouls 2 Theme.
*Revision History: 0.1
*
*/


//Game UI
var canvas;
var stage: createjs.Stage;

// Game Objects 
var game: createjs.Container;
var background: createjs.Bitmap;
var spinButton: createjs.Bitmap;
var betMax: createjs.Bitmap;
var betHalf: createjs.Bitmap;
var betOne: createjs.Bitmap;
var tiles: createjs.Bitmap[] = [];
var tileContainers: createjs.Container[] = [];

// Game Variables
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;


/* Tally Variables */
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;


/*
*This method sets the game loop and canvas up.
*We are running at 60 frames per second.
*
*/
function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20); // Enable mouse events
    createjs.Ticker.setFPS(60); // 60 frames per second
    createjs.Ticker.addEventListener("tick", gameLoop);

    main();
}

/*
*Self explanitory, each frame, run this loop, update the stage.
*
*/
function gameLoop() {


    stage.update(); // Refreshes our stage
}


/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    grapes = 0;
    bananas = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}

// Event handlers each handler makes the button it belongs to either alpha, unalphaed or runs the betting function.

function MaxButtonOut() {
    betMax.alpha = 1.0;
}

function MaxButtonOver() {
    betMax.alpha = 0.5;
}

function MaxClicked() {

    if (playerBet >= 1) {
        playerMoney += playerBet;
        playerBet = 0;
    }

    if (playerMoney >= 100)
    {
        playerMoney -= 100;
        playerBet = 100;
        console.log("You bet" + playerBet + ": of " + playerMoney + " souls left.");
    }
    else
    {
        return;
    }
}

function HalfClicked() {

    if (playerBet >= 1) {
        playerMoney += playerBet;
        playerBet = 0;
    }

    if (playerMoney >= 50) {
        playerMoney -= 50;
        playerBet = 50;
        console.log("You bet" + playerBet + ": of " + playerMoney + " souls left.");
    }
    else {
        return;
    }
}

function OneClicked() {

    if (playerBet <= 99 && playerMoney >= 1) {
        playerBet++;
        playerMoney--;
        console.log("You bet" + playerBet + ": of " + playerMoney + " souls left.");
    }
    else {
        return;
    }
}

function HalfButtonOut() {
    betHalf.alpha = 1.0;
}

function HalfButtonOver() {
    betHalf.alpha = 0.5;
}

function OneButtonOut() {
    betOne.alpha = 1.0;
}

function OneButtonOver() {
    betOne.alpha = 0.5;
}

function ButtonOut() {
    spinButton.alpha = 1.0;
}

function ButtonOver() {
    spinButton.alpha = 0.5;
}

/*
*Our actual spinning method, get the results of the array in spaces 0 1 2 which is slot 1 2 3 in normal language.
*Load the spun reels image as well here.
*/
function spinReels() {

    if (playerBet >= 1) {
        //Nom player bet and add to jack pot
        jackpot += playerBet;
        playerBet = 0;

        // Add Spin Reels code here
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        //console.log(fruits);


        for (var tile = 0; tile < 3; tile++) {
            if (turn > 0) {
                game.removeChild(tiles[tile]);
            }
            tiles[tile] = new createjs.Bitmap("assets/images/" + spinResult[tile] + ".png");
            tiles[tile].x = 185 + (131 * tile);
            tiles[tile].y = 133;

            game.addChild(tiles[tile]);
            //console.log(game.getNumChildren());
        }
    }

    else {
        return;
    }
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blanksoul";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "tinysoul";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "smallsoul";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "mediumsoul";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "largesoul";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "grandsoul";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "whitesoul";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "lordsoul";
                sevens++;
                break;
        }
    }
    return betLine;
}


/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = playerBet * 10;
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
            winnings += jackpot;
            console.log("YOU WON THE JACKPOT OF: " + jackpot + "!");
            jackpot = 0;
        }
        else if (grapes == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
        }
        else {
            winnings = playerBet * 1;
        }

        if (sevens == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        playerMoney += winnings;
        winnings = 0;
       // showWinMessage();
    }
    else {
        lossNumber++;
      //  showLossMessage();
    }

}

/*
*Creates all the background and visual assets, this is run once.
*
*/
function createUI():void {
    // instantiate my background
    background = new createjs.Bitmap("assets/images/SoulsMachine.png");
    game.addChild(background);

    // Bet Button s
    betMax = new createjs.Bitmap("assets/images/betMax.png");
    betMax.x = 129;
    betMax.y = 362;

    betMax.addEventListener("click", MaxClicked);
    betMax.addEventListener("mouseover", MaxButtonOver);
    betMax.addEventListener("mouseout", MaxButtonOut);
    game.addChild(betMax);

    betHalf = new createjs.Bitmap("assets/images/betHalf.png");
    betHalf.x = 253;
    betHalf.y = 360;

    betHalf.addEventListener("click", HalfClicked);
    betHalf.addEventListener("mouseover", HalfButtonOver);
    betHalf.addEventListener("mouseout", HalfButtonOut);
    game.addChild(betHalf);

    betOne = new createjs.Bitmap("assets/images/betOne.png");
    betOne.x = 375;
    betOne.y = 362;

    betOne.addEventListener("click", OneClicked);
    betOne.addEventListener("mouseover", OneButtonOver);
    betOne.addEventListener("mouseout", OneButtonOut);
    game.addChild(betOne);

    // Spin Button 
    spinButton = new createjs.Bitmap("assets/images/spinButton.png");
    spinButton.x = 499;
    spinButton.y = 360;
    game.addChild(spinButton);

    spinButton.addEventListener("click", spinReels);
    spinButton.addEventListener("mouseover", ButtonOver);
    spinButton.addEventListener("mouseout", ButtonOut);
}



// Our Game Kicks off in here
function main() {
    // instantiate my game container
    game = new createjs.Container();
    game.x = 23;
    game.y = 6;

    // Create Slotmachine User Interface
    createUI();


    stage.addChild(game);
}