import React, {useEffect, useState} from "react";
import Move from "./move";
import Badge from "./components/badge";
import CardHeader from "./components/card-header";
import Card from "./components/card";
import CardBody from "./components/card-body";
import Container from "./components/container";
import PlayerMove from "./components/player-move";
import ProgressBar from "./components/progress-bar";
import PlayerMoveMessage from "./components/player-move-message";

const COUNTER_BASE_VALUE = 60;
const COUNTER_INCREMENT_PER_LEVEL = 10;
let totalTries=0;
let totalGame=0;
function App(props) {

    let initialGameState = {
        level: 3,
        secret: createSecret(3),
        tries: 0,
        guess: 50,
        moves: [],
        counter: 60,
        lives: 3,
        totalTries:0
    };
    let initialStatState = {
        wins: 0,
        loses: 0,
        total: 0,
        totalWinMoves: 0,
        avgWinMoves: totalTries/totalGame
    };

    const [game, setGame] = useState(initialGameState);
    const [statistics, setStatistics] = useState(initialStatState);



    function getInitialCounter(level) {
        return COUNTER_BASE_VALUE + COUNTER_INCREMENT_PER_LEVEL * (level - 3);
    }

    function initGame(game, statistics) {
        if (game.lives === 0) {
            game.level = game.level === 3 ? 3 : game.level - 1;
            game.lives = 3;
            statistics.loses++;
            statistics.total++;
            statistics.avgWinMoves=game.total/game.tries;
        } else {
            game.lives--;
        }
        game.tries = 0;
        game.secret = createSecret(game.level);
        game.moves = [];
        game.counter = getInitialCounter(game.level);
    }

    function persistStateToLocalStorage() {
        localStorage.setItem(
            "mastermind", JSON.stringify(
                {
                    'game': {...game},
                    'statistics': {...statistics}
                }
            )
        );
    }

    useEffect(() => {
        let timerId = setInterval(() => {
            let newGame = {...game};
            let newStatistics = {...statistics};
            newGame.counter--;
            if (newGame.counter <= 0) {
                initGame(newGame, newStatistics);
            }
            setGame(newGame);
            setStatistics(newStatistics);
        }, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, [game]);
    useEffect(() => {
        let localState = JSON.parse(localStorage.getItem("mastermind"));
        if (localState != null) {
            setGame(localState.game);
            setStatistics(localState.statistics);
        } else {
            localStorage.setItem(
                "mastermind", JSON.stringify(
                    {
                        'game': {...game},
                        'statistics': {...statistics}
                    }
                )
            );
        }
        return persistStateToLocalStorage;
    }, []);

    //region create random numbers
    function createDigit(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createSecret(level) {
      /*  let digits = [];
        digits.push(createDigit(1, 9));
        while (digits.length < level) {
            let digit = createDigit(0, 9);
            if (digits.includes(digit)) continue;
            digits.push(digit);
        }
        let secret = digits.reduce((s, u) => 10 * s + u, 0);
        console.log(secret);*/
        totalGame++;
        let secret=createDigit(1,100);
        return secret;
    }

    //endregion

    function handleInputChange(event) {
        let guess = Number(event.target.value);
        setGame({...game, guess});
    }

    function play(event) {
        let newGame = {...game};
        let newStatistics = {...statistics};

         totalTries++;
        if (newGame.secret === newGame.guess) {
            newGame.level++;

            // TODO: check whether this is the last level
            newGame.secret = createSecret(newGame.level);
            newGame.moves = [];
            newGame.tries = 0;
            newGame.counter = getInitialCounter(newGame.level);
        } else {
            let move = createMove(newGame.guess, newGame.secret);
            newGame.moves.push(move);
            newGame.tries++;
            newStatistics.avgWinMoves=game.tries/statistics.total;
            if(newGame.tries>7){
                newGame.secret = createSecret(newGame.level);
                newGame.moves = [];
                newGame.tries = 0;

                newGame.counter = getInitialCounter(newGame.level);
                newGame.lives--;
                if (newGame.lives <= 0) {
                   // newGame.level = newGame.level === 3 ? 3 : newGame.level - 1;
                    newGame.lives = 3;
                    newStatistics.loses++;
                    newStatistics.total++;

                }


            }

        }
        setGame(newGame);
        setStatistics(newStatistics);
    }

   /* function createMove(guess, secret) {
        let guessAsString = guess.toString();
        let secretAsString = secret.toString();
        let perfectMatch = 0;
        let partialMatch = 0;
        for (let i = 0; i < guessAsString.length; ++i) {
            let g = guessAsString.charAt(i);
            for (let j = 0; j < secretAsString.length; ++j) {
                let s = secretAsString.charAt(j);
                if (s === g) {
                    if (i === j) {
                        perfectMatch++;
                    } else {
                        partialMatch++;
                    }
                }
            }
        }
        return new Move(guess, perfectMatch, partialMatch);
    }*/
function createMove(guess,secret,counter){
    return new Move(guess,secret);
}
function guessedNumber(game){
        return game.tries/game.total;
}

    return (
        <Container>
            <Card>
                <CardHeader title="Game Console"/>
                <CardBody>

                    <Badge id="tries"
                           label="Tries"
                           value={game.tries}
                           className="alert-danger"></Badge>
                        <ProgressBar value={game.tries} label="tries"></ProgressBar>
                    <Badge id="counter"
                           label="Counter"
                           value={game.counter}
                           className="alert-info"></Badge>
                        <ProgressBar value={game.counter}
                        label="counter"></ProgressBar>

                    <div className="form-group">
                        <label htmlFor="guess">Guess:</label>
                        <input id="guess"
                               type="text"
                               className="form-control"
                               onChange={handleInputChange}
                               value={game.guess}></input>
                        <button onClick={play}
                                className="btn btn-success">Play
                        </button>
                    </div>
                </CardBody>
            </Card>
            <p></p>
            <Card>
                <CardHeader title="Moves"/>
                <CardBody>
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Guess</th>
                            <th>Message</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            game.moves.map((move, index) =>
                                <tr key={move.guess + index.toString()}>
                                    <td>{index + 1}</td>
                                    <td>{move.guess}</td>
                                    <td>{move.message}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            <p></p>
            <Card>
                <CardHeader title="Game Statistics"/>
                <CardBody>
                    <Badge id="wins"
                           label="Wins"
                           value={statistics.wins}
                           className="alert-success"></Badge>
                    <Badge id="avg"
                           label="avg"
                           value={totalTries/totalGame}
                           className="alert-info"></Badge>
                </CardBody>
            </Card>


        </Container>
    );
}

export default App;

//<td><PlayerMove value={move}/></td>
/*
* <Badge id="lives"
                           label="Lives"
                           value={game.lives}
                           className="alert-warning"></Badge>
*
* */
/*<Badge id="loses"
       label="Loses"
       value={statistics.loses}
       className="alert-danger"></Badge>*/