import React, {Component} from "react";

export default class Snake extends Component {

    state = {
        WIDTH: 10,
        HEIGHT: 10,
        BOARD: [],
        APPLE: { x: 1, y: 1 },
        SNAKE: [ {x: 2, y: 4} ],
        SCORE: 0,
        ON_GAME: false,
        LAST_DIRECTION: null,
        LAST_CLICK: null
    }

    drawBoard() {
        const board = []
        for (let y = 0; y < this.state.HEIGHT; y++) {
            for (let x = 0; x < this.state.WIDTH; x++) {
                if(this.state.ON_GAME) {
                    if (x === this.state.APPLE.x && y === this.state.APPLE.y) {
                        board.push("🍎");
                        continue;
                    }
                }
                let flag = true;
                for (let s = 0; s < this.state.SNAKE.length; s++) {
                    if(x === this.state.SNAKE[s].x && y === this.state.SNAKE[s].y) {
                        board.push("🔴")
                        flag = false
                    }
                }
                if(flag) board.push("⚪")
            }
            board.push(<br key={y} />)
        }
        return board;
    }

    tick() {
        setTimeout(()=> this.tick(), 1000 / Math.sqrt(this.state.SCORE + 1 ))

        if(!this.state.ON_GAME) return;
        if(this.state.LAST_CLICK) {
            const {SNAKE} = this.state;
            const head = SNAKE[0];
            console.log(head.x)
            const nextPos = { x: head.x, y: head.y};
            switch (this.state.LAST_CLICK) {
                case 'left':
                    nextPos.x = head.x - 1 < 0 ? this.state.WIDTH - 1 : head.x - 1
                    break;
                case 'right':
                    nextPos.x = head.x + 1 >= this.state.WIDTH ? 0 : head.x + 1
                    break;
                case 'up':
                    nextPos.y = head.y - 1 < 0 ? this.state.HEIGHT - 1 : head.y - 1
                    break;
                case 'down':
                    nextPos.y = head.y + 1 >= this.state.HEIGHT ? 0 : head.y + 1
                    break;
                default:
                    break;
            }


            // control check
            if(this.isSnakeInThePosition(nextPos)) { // game over
                this.gameOver()
                alert("Game over")
            }
            else {
                SNAKE.unshift(nextPos);
                if (SNAKE.length > this.state.SCORE + 1) SNAKE.pop();
                this.setState({SNAKE, LAST_DIRECTION: this.state.LAST_CLICK})
                this.step()
            }
        }
    }

    isSnakeInThePosition = (pos) => this.state.SNAKE.find(part => part.x === pos.x && part.y === pos.y)

    step () {
        if(this.state.APPLE.x === this.state.SNAKE[0].x && this.state.APPLE.y === this.state.SNAKE[0].y) {
            this.setState({
                SCORE: this.state.SCORE + 1
            })
            this.locateApple()
        }
    }

    locateApple () {
        const APPLE = { x: 0, y: 0 }
        do {
            APPLE.x = parseInt(Math.random() * this.state.WIDTH);
            APPLE.y = parseInt(Math.random() * this.state.HEIGHT);
        } while (this.isSnakeInThePosition(APPLE));
        this.setState({ APPLE })
    }

    gameOver = () => {
        if (!this.state.ON_GAME) return;
        this.setState({
            WIDTH: 10,
            HEIGHT: 10,
            BOARD: [],
            APPLE: { x:1, y:1 },
            SNAKE: [ {x: 2, y: 4} ],
            SCORE: 0,
            ON_GAME: false,
            LAST_DIRECTION: null,
            LAST_CLICK: null
        })
    }

    move (direction) {
        if(!this.state.ON_GAME) return;
        let {LAST_CLICK, LAST_DIRECTION} = this.state;
        switch (direction) {
            case 'left':
                if(LAST_DIRECTION !== 'right') LAST_CLICK = 'left';
                break;
            case 'right':
                if(LAST_DIRECTION !== 'left') LAST_CLICK = 'right';
                break;
            case 'up':
                if(LAST_DIRECTION !== 'down') LAST_CLICK = 'up';
                break;
            case 'down':
                if(LAST_DIRECTION !== 'up') LAST_CLICK = 'down';
                break;
            default:
                break;
        }
        this.setState({LAST_CLICK})
    }

    newGame = () => {
        if(this.state.ON_GAME) return;
        this.setState({
            ON_GAME: true,
            SCORE: 0,
            SNAKE: [ {x: 2, y: 4} ],
        })
        this.locateApple()
    }

    componentDidMount() {
        this.tick()
    }


    render() {
        return(
            <div className='snake' >

                {this.drawBoard()}

                <div className='d-flex flex-column align-items-center mt-2' >
                    <div className='d-flex flex-column justify-content-center align-items-center' >
                        <div>
                            <button className='btn btn-primary mx-1' onClick={()=> this.move('up')} >
                                <i className="fas fa-chevron-up" />
                            </button>
                            <button className='btn btn-primary mx-1' onClick={()=> this.move('down')} >
                                <i className="fas fa-chevron-down" />
                            </button>
                        </div>
                        <div className='mt-1' >
                            <button className='btn btn-primary mx-1' onClick={()=> this.move('left')} >
                                <i className="fas fa-chevron-left" />
                            </button>
                            <button className='btn btn-primary mx-1' onClick={()=> this.move('right')} >
                                <i className="fas fa-chevron-right" />
                            </button>
                        </div>
                    </div>
                    <div className='mt-2' >
                        <button className='btn btn-success mx-1' onClick={()=> this.newGame()} ><i className="fas fa-check" /></button>
                        <button className='btn btn-danger mx-1' onClick={()=> this.gameOver()} ><i className="fas fa-times" /></button>
                    </div>
                </div>
            </div>
        )
    }
}