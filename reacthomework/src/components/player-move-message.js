import React from "react";

export default function PlayerMoveMessage(props){
    let message="";
    let game=props.value;
    if(game.guess<game.secret){
       message= <span
            className="badge alert-danger">"Pick Larger!"</span>
    }
    if(game.guess>game.secret){
        message= <span
            className="badge alert-danger">"Pick Smaller!"</span>
    }
    if(game.counter==0){
        message= <span
            className="badge alert-danger">"Game Over"</span>
    }
    return(
        <div>
            {message}
        </div>
    );
}