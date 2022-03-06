import React from "react";

export default function ProgressBar(props){

    //bgcolor,progress,height
    let bgcolor;
    let deger=Math.trunc((props.value*100)/60);
    //let deger= ~~Number((props.value*100)/60);
    if(deger>=70){

        bgcolor="#99ff66";
    }

    else{
        if(deger>=30&&deger<70){
            bgcolor="orange";
        }
        else{
            bgcolor="red";
        }

    }
        const Parentdiv = {
            height: 30,
            width:'80%',
            backgroundColor: 'whitesmoke',
            borderRadius: 40,
            margin: 50
        }

        const Childdiv = {
            height: 30,
            width: `${deger}%`,
            backgroundColor: bgcolor,
            borderRadius:40,
            textAlign: 'right'
        }

        const progresstext = {
            padding: 10,
            color: 'black',
            fontWeight: 500
        }

        return (
            <div style={Parentdiv}>
                <div style={Childdiv}>
                    <span style={progresstext}>{`${deger}%`}</span>
                </div>
            </div>
        );



}
/*<div >
   <h3 className="heading">Progress Bar</h3>
   <Progress_bar bgcolor="orange" progress='30'  height={30} />
    <Progress_bar bgcolor="red" progress='60'  height={30} />
    <Progress_bar bgcolor="#99ff66" progress='50'  height={30} />
    <Progress_bar bgcolor="#ff00ff" progress='85'  height={30} />
    <Progress_bar bgcolor="#99ccff" progress='95'  height={30} />
</div>*/