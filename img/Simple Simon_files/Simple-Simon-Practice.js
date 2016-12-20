/**
 * Created by rubenvarela on 12/9/16.
 */
(function() {
    "use strict";

    //array for saved computer moves
    var savedMoves = [];
    //array for user chosen moves
    var userMoves = [];
    // counter for round number
    var counter = 1;
    //variable that stores roundCounterHeader id for later use within roundCounter function
    var counterHeader = document.getElementById("roundCounterHeader");
    //variable that stores highScore id for later use within updateHighScore function
    var highScore = document.getElementById("highScore");
    //variable that tells fadeSquare function it's being called from a mouse click listener
    var clicked = false;

    function play() {

        //function for generating random number between 1 and 4
        var generateRandomNumber = function() {
            return Math.floor(Math.random() * 4) + 1;
        };

        //function for assigning square a number
        var assignSquare = function(number) {
            if(number == 1) {
                fadeSquare("red");
                savedMoves.push("red");
            } else if(number == 2) {
                fadeSquare("green");
                savedMoves.push("green");
            } else if(number == 3) {
                fadeSquare("blue");
                savedMoves.push("blue");
            } else if(number == 4) {
                fadeSquare("yellow");
                savedMoves.push("yellow");
            }
        };
        assignSquare(generateRandomNumber());

        function assignAndGenerate() {
            assignSquare(generateRandomNumber());
        }

        //function for fading squares and playing sound
        function fadeSquare(square) {
            $("#" + square).fadeTo(200, 0);
            $("#" + square).fadeTo(300, 1);
            if (clicked == true) {
                $("#clickAudio").trigger("play");
            } else {
                $("#sequenceAudio").trigger("play");
            }
        }

        //function that fades square that was clicked on
        var selectedSquare;
        $(".square").click(function () {
            selectedSquare = this.id;
            userMoves.push(this.id);
            compareArrays();
        });

        //function to compare savedMoves array vs userMoves array,
        //it is triggered every time the user clicks on a square
        var i = 0;
        function compareArrays() {
            if (savedMoves[i] == userMoves[i]) {
                clicked = true;
                fadeSquare(selectedSquare);
                clicked = false;
                i++;
                if(userMoves.length == savedMoves.length) {
                    userMoves = [];
                    i = 0;
                    setTimeout(playSequence, 1000);
                }
            } else {
                userMoves = [];
                savedMoves = [];
                counter = 1;
                roundCounter();
                $(".container > .row").hide();
                $(".container").addClass("explosion");
                $("#explosionAudio").trigger("play");
                setTimeout(function () {
                    $(".container").removeClass("explosion");
                    $(".gameOverDiv").show();
                }, 850)
            }
        }

        //function that plays back sequence after every round
        var playSequence = function () {
            savedMoves.forEach(function (box, index) {
                setTimeout(function () {
                    fadeSquare(box);
                }, (500*index));
                if(index == savedMoves.length - 1) {
                    setTimeout(assignAndGenerate, 500*index+500);
                }
            });
            counter++;
            roundCounter();
            updateHighScore();
        };

        //function for keeping track of the round
        function roundCounter() {
            counterHeader.innerHTML = counter
        }
        roundCounter();

        //function for storing and displaying user's high score
        function updateHighScore() {
            highScore.innerHTML = counter
        }
        updateHighScore();
    }

    //variable that stores playButton id for later use in playButton function
    var playButton = document.getElementById("playButton");

    //variable that stores whether the playButton has been clicked or not
    var playButtonClicked = false;

    $("#playButton").click(function() {
        if (playButtonClicked == false) {
            play();
            playButton.innerHTML = "Reset";
            playButtonClicked = true;
        } else if (playButtonClicked == true) {
            savedMoves = [];
            userMoves = [];
            counter = 1;
            clicked = false;
            playButton.innerHTML = "Play";
            playButtonClicked = false;
        }
    })
})();