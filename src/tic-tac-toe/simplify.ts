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
	/**当前胜了吗？谁胜了 */
	winner?:"X"|"O"|"FAIR"
	/**下落点0~8,初始-1*/
	point: N9Step | -1
}

/**
 * 可以进一步优化，因为某个棋落下时触发，要么这个棋胜利，即找这个棋的横、竖、双斜是否完全相同
 * @param squares 
 * @returns 
 */
function calculateWinner(squares:N9Square):"X"|"O" {
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
      return squares[a] as any
    }
  }
  return null;
}

function board(p:{
  value():string
  click():void
	background():string
}){
  return dom({
    type:"button",cls:"square",
		style:{
			background:p.background
		},
    event:{
      click:p.click
    },
    text:p.value
  })
}
function renderBoard(p:{
  square():N9Square
	point():number
  click(i:N9Step):void
}){
  function renderCell(i:number){
    return board({
      value(){
        return p.square()[i]
      },
      click(){
        p.click(i as N9Step)
      },
			background(){
				return p.point()==i?'gray':''
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
 * 可以进一步优化，历史记录变成历史操作记录撤销与重做
 * @param me 
 * @returns 
 */
export function ticTacToeSimplify(me:mve.LifeModel){
  const historys=mve.arrayModelOf<History>([
    {
      squares:Array(9).fill(null) as N9Square,
      xIsNext:true,
			point:-1
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
						point(){
							return historys.get(stepNumber()).point
						},
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
              if(current.winner || squares[i]){
                return
              }
              squares[i] = current.xIsNext ? 'X' : 'O'

							const winner=calculateWinner(squares) || (historys.size()==9?'FAIR':null)
              historys.push({
                squares,
                xIsNext:!current.xIsNext,
								point:i,
								winner
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
              const winner=current.winner
              return winner ? `Winner: ${winner}` : `Next player: ${current.xIsNext ? 'X' : 'O'}`
            }
          }),
					//历史记录
          dom({
            type:"ol",
            children:[
							modelChildren(historys,function(me,history,i){
								return dom({
									type:"li",
									children:[
										dom({
											type:"button",
											style:{
												color(){
													return i()==stepNumber()?"blue":''
												}
											},
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