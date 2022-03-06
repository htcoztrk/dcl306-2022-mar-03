class Move {
   /* constructor(guess, perfect, partial) {
        this.guess = guess;
        this.message = "";
        this.perfect = perfect;
        this.partial = partial;
        if (perfect === 0 && partial === 0) {
            this.message = "No Match";
        } else {
            if (partial > 0)
                this.message += "-" + partial;
            if (perfect > 0)
                this.message += "+" + perfect;
        }
    }*/
    constructor(guess,secret,counter){
        this.guess = guess;
        this.message = "";
        this.secret=secret;
        this.counter=counter;
        if(guess<secret){
            this.message="Pick Largest!";

        }
        else if (guess>secret){
            this.message="Pick Smallest!";
        }
        else if(counter==0){
            this.message="Game Over!"
        }
    }
}

export default Move;