import React, { Component } from 'react';
import EmotionSet from './EmotionSet';
import './App.css';
import { emotionsSimple} from './emotions'
import { fate, getRandomIntInclusive, livingNeighbors } from './utils.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.addLife = this.addLife.bind(this);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.newBoard = this.newBoard.bind(this);
    this.renderWorld = this.renderWorld.bind(this);
    this.startTime = this.startTime.bind(this);
    this.stopTime = this.stopTime.bind(this);
    this.changeEmojiToAdd = this.changeEmojiToAdd.bind(this);
    this.emos = new EmotionSet(emotionsSimple);

    const defaultBoardSize = {
      width: Math.floor(window.innerWidth / this.props.emojiSize), 
      height: Math.floor(window.innerHeight / this.props.emojiSize)
    };

    this.state = {
      board: this.populateBoard(this.getBoard(
        defaultBoardSize.width,
        defaultBoardSize.height
      )),
      boardSize: defaultBoardSize,
      generation: 0,
      paused: false,
      speed: 110,
      emojiToAdd: 5
    };
  }

  componentDidMount() {
    this.startTime();
  }

  componentWillUnmount() {
    this.stopTime();
  }

  addLife(x, y) {
    console.log(this.emos.emotions[this.state.emojiToAdd]);
    this.setState({
      board: [
        ...this.state.board.slice(0, y),
        [
          ...this.state.board[y].slice(0, x),
          this.state.board[y][x].age === 0 ? 
            ({
              age: 1,
              emo: this.state.emojiToAdd
            }) : 
            ({
              ...this.state.board[y][x],
              emo: this.state.emojiToAdd
            }),
          ...this.state.board[y].slice(x + 1)
        ],
        ...this.state.board.slice(y + 1)
      ]
    });
  }

  changeSpeed(e) {
    this.setState({
      speed: e.target.value
    }, 
      !this.state.paused ? 
        this.startTime : null
    );
  }
  
  newBoard(width, height, clear = false) {
    const board = this.getBoard(parseInt(width), parseInt(height));
    this.setState({
      board: clear ? board : this.populateBoard(board),
      generation: 0
    });
  }

  startTime(speed) {
    clearInterval(this.time);
    if(speed) {
      this.setState({speed});
    }
    this.time = setInterval(
      () => {
        this.setState({
          board: this.getNextGeneration(this.state.board),
          generation: this.state.generation + 1,
          paused: false
        })
      }, 
      speed || this.state.speed
    );
  }

  stopTime() {
    this.setState({paused: true});
    clearInterval(this.time);
  }

  getBoard(width = 50, height = 30) {
    return new Array(height).fill(new Array(width).fill(0));
  }

  populateBoard(board) {
    return board.map(
      row => row.map(
        cell => {
          const alive = Math.round(Math.random());
          return {
            age: alive,
            emo: alive ? getRandomIntInclusive(1, 10) : 0
          };
        }
      )
    );
  }

  getNextGeneration(board) {
    return board.map((row, y) => row.map((cell, x) => fate({cell, x, y, board, getEmo: this.emos.getEmotion})));
  }

  changeEmojiToAdd(e) {
    this.setState({emojiToAdd: parseInt(e.target.value, 10) + 1});
  }

  renderWorld() {
    return (
      <div 
        className="board" 
        style={{
          fontSize: Math.min(
            Math.floor(
              window.innerWidth / this.state.board[0].length
            ),
            Math.floor(
              window.innerHeight / this.state.board[0].length
            )
          ) + 'px'
        }}
      >
        {this.state.board.map(
          (row, y) => 
            <div key={'row-' + y}>
              {row.map(
                (cell, x) => 
                    <div 
                      key={`cell-${x}-${y}`}
                      onClick={(e) => this.addLife(x, y)}
                      className="cell"
                    >
                      {cell.age ? this.emos.emotions[cell.emo] : ''}
                    </div>
              )}
            </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="app">
        <div className="controls">
          <span>Generation: {this.state.generation}</span>
          <span>
            <button 
              onClick={this.state.paused ? 
                (e) => this.startTime() : 
                (e) => this.stopTime()
              }
            >
              {this.state.paused ? 'Resume' : 'Pause'}
            </button>
          </span>
          <span>
            <button 
              onClick={(e) => 
                this.newBoard(
                  this.state.board[0].length, 
                  this.state.board.length, 
                  true
                )
              }
            >
              Clear
            </button>
          </span>
          <span>
            Size: 
            <select 
              onChange={(e) => {
                const [x, y] = e.target.value.split(',');
                this.newBoard(x, y);
              }}
              value={
                this.state.board[0].length + ',' + this.state.board.length
              }
            >
            {[
              {x: this.state.boardSize.width, y: this.state.boardSize.height}, 
              {x: 50, y: 30}, 
              {x: 70, y: 50}, 
              {x: 100, y: 80}
            ].map(
              ({x, y}, key) => 
                <option 
                  key={'size-btn' + key}
                  value={x + ',' + y}
                >
                  {x} x {y}
                </option>
            )}
            </select>
          </span>
          <span>
            Speed: 
            <select 
              onChange={this.changeSpeed}
              value={this.state.speed}
            >
            {[
              {speed: 500, text: 'Really Slow'}, 
              {speed: 200, text: 'Slow'}, 
              {speed: 110, text: 'Medium'}, 
              {speed: 90, text: 'Pretty Fast'}, 
              {speed: 50, text: 'Fast'}
            ].map(
              ({speed, text}, key) => 
                <option 
                  value={speed} 
                  key={'speed-btn' + key}
                >
                  {text}
                </option>
            )}
            </select>
          </span>
          <span>
            Add: 
            <select 
              onChange={this.changeEmojiToAdd} 
              value={this.state.emojiToAdd}
            >
              {this.emos.emotions.slice(1).map(
                (emoji, i) => 
                  <option value={i} key={emoji + i}>{emoji}</option>
              )}
            </select>
          </span>
        </div>
        {this.renderWorld()}
      </div>
    );
  }
}

App.defaultProps = {
  emojiSize: window.innerWidth * .025
};

export default App;