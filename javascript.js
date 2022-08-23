//Gameboard object (module)

//"use strict";

const gameBoard = (() => {
    const board = ["","","","","","","","",""];

    const setMarker = (index, marker) => {
        if(index > board.length) return;
       return board[index] = marker;
    };

    const getMarker = (index) => {
        if(index > board.length) return;
        return board[index];
    };

    const reset = () =>{
        for(let i = 0; i < board.length; i++){
            board[i] = "";
        }
    };

    return{ setMarker, getMarker, reset};
    

})();


//Player object
const Player = (marker) =>{
    this.marker = marker;

    const getMark = () => {
        return marker; 
    }

    return{
        getMark
    };
};

//DisplayController Object: logic for displaying the markers and messages
const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const messageElement = document.querySelector(".words");
    const restartButton = document.querySelector(".restart-btn");

    fieldElements.forEach((field)=>
        field.addEventListener("click", (e) => {
            if(gameController.getIsOver() || e.target.textContent !== "") return;
            
            console.log(gameController.playRound(parseInt(e.target.dataset.index)));
            console.log(updateGameboard());
        })
    );

    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
    });

    const updateGameboard = () => {
        for (let i = 0; i < fieldElements.length; i++){
            fieldElements[i].textContent = gameBoard.getMarker(i);
        }

    };

    const setResultMessage = (winner) => {
        if (winner === "Tie"){
            setMessageElement("It's a tie");
        } else {
            setMessageElement(`${winner} has won`);
        }
    };
    
    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    return { setResultMessage, setMessageElement}


    
})();

//GameController Object: logic for taking turns and determining winner 
const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = (fieldIndex) => {
        console.log(gameBoard.setMarker(fieldIndex, getCurrentPlayerSign()));
        
        if(checkWinner(fieldIndex)){
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round === 9){
            displayController.setResultMessage("Tie");
            isOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(
            `Player ${getCurrentPlayerSign()}'s turn`
        );
        
        
    };

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getMark() : playerO.getMark();
    }

    const checkWinner = (fieldIndex) => { //determine winner 
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];
        
        return winConditions
        .filter((combination) => combination.includes(fieldIndex))
        .some((possibleCombination) => possibleCombination.every(
        (index) => gameBoard.getMarker(index) === getCurrentPlayerSign()
        )
        );
        
    };

    const getIsOver = () => {
        return isOver;
    }

    const reset = () => {
        round = 1;
        isOver = false;
    };

    return {playRound, getIsOver, reset };

})();