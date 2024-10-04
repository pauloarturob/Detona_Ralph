const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector(".menu-lives h2"),
        restartBtn: document.getElementById("restart-btn"),
        acertoSound: document.getElementById("acerto-sound"), 
        erroSound: document.getElementById("erro-sound"), 
        finalResult: document.getElementById("final-result"),
    },
    values: {
        timeId: null,
        gameVelocity: 1000,
        hitPosition: null,
        resultado: 0,
        timeLeft: 30,
        lives: 3,
        gameEnded: false,
        countdownIntervalId: null,
    },
};

function resetGame() {
    clearInterval(state.values.timeId);
    clearInterval(state.values.countdownIntervalId);
    state.values.timeId = null;
    state.values.countdownIntervalId = null;

    state.values.resultado = 0;
    state.values.lives = 3;
    state.values.gameVelocity = 1000;
    state.values.gameEnded = false;
    state.view.score.textContent = state.values.resultado;
    state.view.finalResult.textContent = 0;

    state.values.timeLeft = 30;
    state.view.timeLeft.textContent = state.values.timeLeft;
    state.view.lives.textContent = `X${state.values.lives}`;

    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    init();
}

state.view.restartBtn.addEventListener("click", resetGame);

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * state.view.squares.length);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    clearInterval(state.values.timeId);
    state.values.timeId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (!state.values.gameEnded) {
                if (square.id === state.values.hitPosition) {
                    state.view.acertoSound.play();
                    state.values.resultado++;
                    state.view.score.textContent = state.values.resultado;
                    state.values.hitPosition = null;
                } else {
                    state.view.erroSound.play();
                    state.values.lives--;

                    if (state.values.lives <= 0) {
                        state.values.lives = 0;
                        state.values.gameEnded = true;
                        state.view.finalResult.textContent = state.values.resultado;
                        alert("Fim do jogo! GAME OVER... Seu placar final foi: " + state.values.resultado);
                        clearInterval(state.values.timeId);
                        clearInterval(state.values.countdownIntervalId);
                    }

                    state.view.lives.textContent = `X${state.values.lives}`;
                }
            }
        });
    });
}

function countdown() {
    state.view.timeLeft.textContent = state.values.timeLeft;

    state.values.countdownIntervalId = setInterval(() => {
        if (!state.values.gameEnded) {
            state.values.timeLeft--;

            if (state.values.timeLeft >= 0) {
                state.view.timeLeft.textContent = state.values.timeLeft;

                if (state.values.gameVelocity > 200) {
                    state.values.gameVelocity -= 50;
                    moveEnemy();
                }
            } else {
                clearInterval(state.values.countdownIntervalId);
                clearInterval(state.values.timeId);
                state.values.gameEnded = true;
                state.view.finalResult.textContent = state.values.resultado;
                alert("Fim do jogo! GAME OVER... Seu placar final foi: " + state.values.resultado);
            }
        }
    }, 1000);
}

function init() {
    moveEnemy();
    addListenerHitBox();
    countdown();
}

init();
