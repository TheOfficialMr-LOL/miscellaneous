
/*

'x' will represent the computer 
'o' will represent the player



The player will always start first
The computer will use the minimax algorithm along with alpha-beta pruning to find the best move



Connect 4 board

0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
0 0 0 o 0 0 0 
0 0 0 x 0 0 0 
0 0 0 o 0 0 0 

00000
*/



class tree {
    constructor(state) {
        this.state = state;
        this.value=null;
        this.children = [];
        
    }
}










/*
First move: '00000' or '10000' or '20000' or '30000' or '40000' or '50000' or '60000'


*/

//generating initial queue -- this will only have to be generated once
const initialQueue = generate_initial_queue();




function generate_initial_queue() {
  let queue = [];

  for (let i=0; i<7; i++) {
    for (let j=0; j<7; j++) {
      for (let k=0; k<7; k++) {
        for (let l=0; l<7; l++) {
          for (let m=0; m<7; m++) {
            //appending the state to the queue
            state=i.toString() + j.toString() + k.toString() + l.toString() + m.toString();
            queue.push(state);
          }
        }
      }
    }
  }
  


  return queue;
}



let column=minimax('0', 5, initialQueue);
console.log('Column to select:', column)

function minimax(state, depth, queue) {
    if(queue.length===16807) {
        

        let scores=[];
        for (let index=0; index<queue.length; index++) {
            scores.push(get_score(queue[index]));
        }
        queue=scores;
        
    }

    let newQueue=[]; //new queue to be returned
    let score=0;
    for (let i=0; i<(queue.length/7); i=i+7) {
        window=[queue[i], queue[i+1], queue[i+2], queue[i+3], queue[i+4], queue[i+5], queue[i+6]];

        //check if the current depth allows the player to choose a column


        //minimzing player chooses a column if depth is even
        if (depth%2===0) {
            //choosing the minimum score from the current window
            score=Math.min(...window);
        }
        //maximizing player chooses a column if depth is odd
        else {
            //maximizing player chooses a column if depth is odd
            score=Math.max(...window);

        }
        //appending the score to the new queue
        newQueue.push(score);
    }
    if(newQueue.length!=7) {
        return minimax(null, depth-1, newQueue);
    }
    else {

        //find the column with the maximum score
        return newQueue.indexOf(Math.max(...newQueue)); //return the index of the maximum score
    }
}






//initializing tree
//startingPosition='0';
//const rootNode=minimax(0, 2, startingPosition);

//const start=Date.now();
//BFS(rootNode);
//console.log('Time taken to generate tree:', Date.now()-start, 'ms');









//recursively building the tree
/*
function minimax(currentLevel, maxLevel, state) {
    const node=new tree(state)

    if(currentLevel<maxLevel) {
        for (let i=0; i<7; i++) {
            //console.log('Current state:', state+i);
            const child=minimax(currentLevel+1, maxLevel, state + i);
            node.children.push(child);
        }
    }
    return node;
}
*/








/*
This function calculates the score of the last move made in the game.
It checks the last move made and generates a scoring list in all four directions:
1. Horizontal
2. Vertical
3. Diagonal (both directions)
It then calculates the score based on the number of consecutive pieces in each direction.
*/

function get_score(state) {
    let board=convert_state_to_matrix(state);
    let finalScore=0; //final score to be returned


    //generating scoring windows in each direction

    //index of last move i.e. the last element in the state
    //let lastMove=parseInt(state[state.length-1]);

    //let indexes=[]; //in the form of [row, column]

    //finding the row of the last move
    /*
    for (let row=0; row<6; row++) {
        if(board[row][lastMove]!==0) {
            indexes.push(row);
            break;
        }
    }
    indexes.push(lastMove);
    */


    //generating scoring list in each direction

    //horizontal windows
    for (let column=0; column<(7-3); column++) {
        for (let row=0; row<6; row++) {

            //generating 4-cell scoring window
            let window=[[row, column],
                        [row, column+1],
                        [row, column+2],
                        [row, column+3]];

            //evaluating score based on the current window
            finalScore+=evaluate_score_based_on_window(board, window);
        }
    }
    

    //vertical windows
    for (let column=0; column<7; column++) {
        for (let row=0; row<(6-3); row++) {

            //generating 4-cell scoring window
            let window=[[row, column],
                        [row+1, column],
                        [row+2, column],
                        [row+3, column]];

            //evaluating score based on the current window
            finalScore+=evaluate_score_based_on_window(board, window);
        }
    }


    //diagonal window \
    for (let column=0; column<(7-3); column++) {
        for (let row=0; row<(6-3); row++) {

            //generating 4-cell scoring window
            let window=[[row, column],
                        [row+1, column+1],
                        [row+2, column+2],
                        [row+3, column+3]];

            //evaluating score based on the current window
            finalScore+=evaluate_score_based_on_window(board, window);
        }
    }


    //diagonal window /
    count=0;
    for (let column=0; column<(7-3); column++) {
        for (let row=3; row<6; row++) {

            //generating 4-cell scoring window
            let window=[[row, column],
                        [row-1, column+1],
                        [row-2, column+2],
                        [row-3, column+3]];
            count++;

            //evaluating score based on the current window
            finalScore+=evaluate_score_based_on_window(board, window);
        }
    }

    //returning final score
    return finalScore;

}

const time=Date.now();
let score=get_score('343')
console.log('Final score:', score);
console.log('Time taken to calculate score:', Date.now()-time, 'ms');





/*
This function evaluates the score of a given window of cells in the Connect 4 board.
It checks the number of 'x' and 'o' pieces in the window and applies scoring heuristics based on the number of 
consecutive pieces.
It returns a score based on the heuristics defined.

Future changes: 
- Add more heuristics for scoring (more points for centre column?)
- dynamic scoring perhaps

*/


function evaluate_score_based_on_window(board, window) {

    let score=0;

    //checking if window is filled with '0's, and if it it, return 0
    let zeroCount=0;
    for (let cell of window) {
        let row=cell[0];
        let column=cell[1];

        if(board[row][column]===0) {zeroCount++;}
    }
    if (zeroCount===4) {return 0;} //if the window is empty, return 0
    


    //tabulating the number of 'x' and 'o' in the current window
    let xCount=0;
    let oCount=0;

    //looping through each cell in the window
    for (let cell of window) {

        let row=cell[0];
        let column=cell[1];

        if(board[row][column]==='x') {xCount++;}
        else if(board[row][column]==='o') {oCount++;}
    }

    //applying scoring heuristics

    //checking if the current window is 'pure' -- this means that it only has one type of piece and the rest are empty
    if (xCount===0 || oCount===0) {
        //pure window
        //begin applying scoring heuristics
        
        if (xCount===4) {score+=1000000;} //4 in a row for the computer
        else if (oCount===4) {score+=-1000000;} //4 in a row for the player
        else if (xCount===3) {score+=100;} //3 in a row for the computer
        else if (oCount===3) {score+=-80;} //3 in a row for the player
        else if (xCount===2) {score+=10;} //2 in a row for the computer
        else if (oCount===2) {score+=-5;} //2 in a row for the player
    }

    //console.log(score);
    return score;

}





//breadth first search
function BFS(root) {
    const queue=[root];

    while (queue.length>0) {
        const currentNode=queue.shift(); //removing from the front of the queue
        convert_state_to_matrix(currentNode.state);
        //console.log(currentNode.state);

        //add all children of current node to queue
        for (let child of currentNode.children) {
            queue.push(child);
        }

    }
}


//convert state into matrix
function convert_state_to_matrix(state) {

    
    let board=[
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];

    //state: 01
    //we will assume that it is the player's turn when turn is divisible by 2
    let turn=0;

    for (let i of state) {
        let row=parseInt(i);

        //checking if the column is full
        for (let column=5; column>=0; column--) {
            if(board[column][row]===0) {
                if(turn%2===0) {board[column][row]='x';}
                else {board[column][row]='o';}
                turn++;
                break;
            }
        }
    }
    
    /*
    for (let row of board) {console.log(row);}
    console.log('------------------');
    console.log('------------------');
    console.log('------------------');
    */
   return board;
    
}
