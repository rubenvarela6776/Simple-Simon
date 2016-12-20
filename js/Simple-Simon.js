/**
 * Created by rubenvarela on 12/9/16.
 */
(function() {
    "use strict";
    var savedMoves = [];    //array for saved computer moves
    var userMoves = [];    //array for user chosen moves
    var counterHeader = document.getElementById("roundCounterHeader");  //variable that stores roundCounterHeader id for later use within roundCounter function
    var highScoreID = document.getElementById("highScore");     //variable that stores highScore id for later use within updateHighScore function
    var playButton = document.getElementById("playButton");    //variable that stores playButton id for later use in playButton function
    var counter = 1;    // counter for round number
    var highScore = 1;  //variable that stores the user's high score
    var playButtonClicked = false;  //variable that stores whether the playButton has been clicked or not
    var squareClicked = false;  //variable that tells fadeSquare function it's being called from a mouse click
    var enableClick = false;   //variable that helps toggle when the squares can be clicked
    var selectedSquare;  //variable that stores the id of the square that was clicked

    var generateRandomNumber = function() {     //function for generating random number between 1 and 4
        return Math.floor(Math.random() * 3);
    };

    var assignSquare = function(number) {       //function for assigning square a number
        var colors = ['red', 'yellow', 'blue', 'green'];
        var selectedColor = colors[number];
        fadeSquare(selectedColor);
        savedMoves.push(selectedColor);
    };

    function fadeSquare(square) {   //function for fading squares and playing sound
        $("#" + square).fadeTo(200, 0);
        $("#" + square).fadeTo(300, 1);
        if (squareClicked == true) {
            $("#clickAudio").trigger("play");
        } else {
            $("#sequenceAudio").trigger("play");
        }
    }

    $(".square").click(function () {    //function that fades square that was clicked on
        if(enableClick == true) {
            selectedSquare = this.id;
            userMoves.push(this.id);
            compareArrays();
        }
    });

    var i = 0;
    function compareArrays() {                      //function to compare savedMoves array vs userMoves array, it is triggered every time the user clicks on a square
        if (savedMoves[i] == userMoves[i]) {
            squareClicked = true;
            fadeSquare(selectedSquare);
            squareClicked = false;
            i++;
            if(userMoves.length == savedMoves.length) {
                wonRound()
            }
        } else {
            failed();
        }
    }

    var playSequence = function () {        //function that plays back sequence after every round
        savedMoves.forEach(function (box, index) {
            setTimeout(function () {
                fadeSquare(box);
            }, (500*index));
        });
        setTimeout(function() {
            assignSquare(generateRandomNumber());
            enableClick = true;
        }, 500*(savedMoves.length - 1)+500);
        counter++;
        roundCounter();
        updateHighScore();
    };

    function wonRound() {
        userMoves = [];
        i = 0;
        enableClick = false;
        setTimeout(playSequence, 1000);
    }

    function failed() {
        $(".container > .row").hide();
        $(".container").addClass("explosion");
        $("#explosionAudio").trigger("play");
        setTimeout(function () {
            $(".container").removeClass("explosion");
            $(".gameOverDiv").show();
        }, 850)
    }

    function roundCounter() {       //function for keeping track of the round
        counterHeader.innerHTML = counter;
    }
    roundCounter();

    function updateHighScore() {    //function for storing and displaying user's high score
        if(highScore <= counter) {
            highScore = counter;
            highScoreID.innerHTML = highScore
        } else if(highScore > counter) {
            highScoreID.innerHTML = highScore
        }
        // localStorage.lastname = "Smith";
        // document.getElementById("result").innerHTML = localStorage.lastname;
    }
    updateHighScore();

    function reset() {      //function for resetting simple simon game
        playButton.innerHTML = "Play";
        playButtonClicked = false;
        enableClick = false;
        savedMoves = [];
        userMoves = [];
        counter = 1;
    }

    //function for the play button
    $("#playButton").click(function() {
        if (playButtonClicked == false) {
            playButton.innerHTML = "Reset";
            playButtonClicked = true;
            assignSquare(generateRandomNumber());
            roundCounter();
            enableClick = true;
        } else if (playButtonClicked == true) {
            reset();
            roundCounter();
        }
    });

    //function for game over play again button
    $("#gameOverButton").click(function () {
        $(".gameOverDiv").hide();
        $(".container > .row").show();
        reset();
        roundCounter();
    })
})();