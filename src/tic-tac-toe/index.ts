import { mve } from 'mve-core/util'
import { dom } from "mve-dom/index";
import { modelChildren } from 'mve-core/modelChildren'
import  "./index.less"


type N9Value="X"|"O"|null
type N9Square=[
  N9Value,N9Value,N9Value,
  N9Value,N9Value,N9Value,
  N9Value,N9Value,N9Value,
]
type N9Step=0|1|2|3|4|5|6|7|8

interface History{
  squares:N9Square
  xIsNext:boolean
}


function calculateWinner(squares:N9Square) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function board(p:{
  value():string
  click():void
}){
  return dom({
    type:"button",cls:"square",
    event:{
      click:p.click
    },
    text:p.value
  })
}
function renderBoard(p:{
  square():N9Square
  click(i:keyof N9Square & number):void
}){
  function renderCell(i:number){
    return board({
      value(){
        return p.square()[i]
      },
      click(){
        p.click(i)
      }
    })
  }
  return dom({
    type:"div",
    children:[
      dom({
        type:"div",cls:"board-row",
        children:[
          renderCell(0),
          renderCell(1),
          renderCell(2),
        ]
      }),
      dom({
        type:"div",cls:"board-row",
        children:[
          renderCell(3),
          renderCell(4),
          renderCell(5),
        ]
      }),
      dom({
        type:"div",cls:"board-row",
        children:[
          renderCell(6),
          renderCell(7),
          renderCell(8),
        ]
      })
    ]
  })
}

/**
 * 可以优化的点：
 * 1.每局棋可以缓存是否已经成功
 * 2.不全局记录（比如数据库你每次都全局记录？)只记录操作的状态
 * @param me 
 * @returns 
 */
export function ticTacToe(me:mve.LifeModel){
  const historys=mve.arrayModelOf<History>([
    {
      squares:Array(9).fill(null) as N9Square,
      xIsNext:true
    }
  ])
  const stepNumber=mve.valueOf(0)
  return dom({
    type:"div",cls:"game-tic-tac-toe",
    children:[
      dom({
        type:"div",cls:"game-board",
        children:[
          renderBoard({
            square(){
              return historys.get(stepNumber()).squares
            },
            click(i){
              const max=stepNumber()+1
              while(historys.size()>max){
                historys.pop()
              }
              const current=historys.get(stepNumber())
              const squares=current.squares.slice() as N9Square
              if(calculateWinner(squares) || squares[i]){
                return
              }
              squares[i] = current.xIsNext ? 'X' : 'O'
              historys.push({
                squares,
                xIsNext:!current.xIsNext
              })
              stepNumber(stepNumber()+1)
            }
          })
        ]
      }),
      dom({
        type:"div",cls:"game-info",
        children:[
          dom({
            type:"div",
            text(){
              const current=historys.get(stepNumber())
              const winner=calculateWinner(current.squares)
              return winner ? `Winner: ${winner}` : `Next player: ${current.xIsNext ? 'X' : 'O'}`
            }
          }),
          dom({
            type:"ol",
            children:[
							modelChildren(historys,function(me,history,i){
								return dom({
									type:"li",
									children:[
										dom({
											type:"button",
											text(){
												return i()?`Go to move #${i()}`:`Go to game start`
											},
											event:{
												click(){
													stepNumber(i())
												}
											}
										})
									]
								})
							})
						]
          })
        ]
      })
    ]
  })
}