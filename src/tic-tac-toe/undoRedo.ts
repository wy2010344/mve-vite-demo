import { dom } from "mve-dom"
import  "./index.less"
import { mve } from 'mve-core/util'
import { modelChildren } from 'mve-core/modelChildren'


type N9Value="X"|"O"|null
type N9Square=[
  N9Value,N9Value,N9Value,
  N9Value,N9Value,N9Value,
  N9Value,N9Value,N9Value,
]
type N9Step=0|1|2|3|4|5|6|7|8
type Operate={
  /**谁下的 */
  who:"X"|"O"
  /**下的点 */
  point:N9Step
}
/**当前状态 */
interface CurrentState{
  stepNumber:N9Step | -1
  square:N9Square
  xIsNext:boolean
  winner?:"X"|"O"|"FAIR"
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
	point():number | null
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
  function renderRow(i:number){
    return dom({
      type:"div",cls:"board-row",
      children:[
        renderCell(i+0),
        renderCell(i+1),
        renderCell(i+2),
      ]
    })
  }
  return dom({
    type:"div",
    children:[
      renderRow(0),
      renderRow(3),
      renderRow(6)
    ]
  })
}

export function ticTacToeUndoRedo(me:mve.LifeModel){
  /**历史操作*/
  const historys=mve.arrayModelOf<Operate>([])
  const current=mve.valueOf<CurrentState>({
    square:Array(9).fill(null) as N9Square,
    xIsNext:true,
    stepNumber:-1
  })
  /**重做 */
  function redo(c:CurrentState){
    const op=historys.get(c.stepNumber+1)
    c.square[op.point]=op.who
    c.xIsNext=!c.xIsNext
    c.stepNumber++
    c.winner=calculateWinner(c.square) || (c.stepNumber == 8 ? 'FAIR' : undefined)
    return c
  }
  /**撤销 */
  function undo(c:CurrentState){
    const op=historys.get(c.stepNumber)
    c.square[op.point]=null
    c.xIsNext=!c.xIsNext
    c.stepNumber--
    c.winner=null
    return c
  }
  return dom({
    type:"div",cls:"game-tic-tac-toe",
    children:[
      dom({
        type:"div",cls:"game-board",
        children:[
          renderBoard({
            point(){
              const step=current().stepNumber
              if(step<0){
                return null
              }
              return historys.get(step).point
            },
            square(){
              return current().square
            },
            click(i){
              const c=current()
              const max=c.stepNumber+1
              while(historys.size()>max){
                //清空原来的历史
                historys.pop()
              }
              if(c.winner || c.square[i]){
                //当前已经是胜利或者有棋子
                return
              }
              historys.push({
                who:c.xIsNext?"X":"O",
                point:i
              })
              current(redo(c))
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
              const c=current()
              return c.winner ? `Winner: ${c.winner}` : `Next player: ${c.xIsNext ? 'X' : 'O'}`
            }
          }),
          //历史记录
          dom({
            type:"ol",
            children:[
              dom({
                type:"li",
                children:[
                  dom({
                    type:"button",
                    text:"init",
                    style:{
                      color(){
                        return -1==current().stepNumber?"blue":''
                      }
                    },
                    event:{
                      click(){
                        const c=current()
                        c.square.fill(null)
                        c.stepNumber=-1
                        c.winner=null
                        c.xIsNext=true
                        current(c)
                      }
                    }
                  })
                ]
              }),
              modelChildren(historys,function(me,history,i){
                return dom({
                  type:"li",
                  children:[
                    dom({
                      type:"button",
                      style:{
                        color(){
                          return i()==current().stepNumber?"blue":''
                        }
                      },
                      text(){
                        return `Go to move #${i()}`
                      },
                      event:{
                        click(){
                          let c=current()
                          if(c.stepNumber < i()){
                            //重做
                            while(c.stepNumber < i()){
                              c=redo(c)
                            }
                            current(c)
                          }else
                          if(c.stepNumber>i()){
                            //撤销
                            while(c.stepNumber > i()){
                              c=undo(c)
                            }
                            current(c)
                          }
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
/**
 * 可以进一步优化，落子时自动判断谁赢
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
