import React from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import "./index.scss";

class Square extends React.Component {
  render() {
    return (
      <div className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </div>
    )
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div className="board">
        <section>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </section>
        <section>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </section>
        <section>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </section>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    if (determineWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? "X" : "O"
    this.setState({
      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = determineWinner(current.squares)

    let status
    if (!winner) {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`
    } else if (winner === "draw") {
      status = "Draw"
    } else {
      status = "Winner is " + winner
    }

    const moves = history.map((step, move) => {
      const description = move ? `Go to move #${move}` : "Go to game start"
      return (
        <li key={move}>
          <Button size="sm" variant="secondary" onClick={() => this.jumpTo(move)}>{description}</Button>
        </li>
      )
    })

    return (
      <Container>
        <Row>
          <Col xs={12} md className="center-content-box">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                />
          </Col>
          <Col xs={12} md className="center-content-box">
            <div className="game-info">
              <div className="status"><h3>{status}</h3></div>
              <ol>{moves}</ol>
              {status === "Draw" && (
                <Button onClick={() => this.jumpTo(0)}>Restart</Button>
                )}
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

function determineWinner(squares) {
  const winCons = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let line of winCons) {
    const [a, b, c] = line
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] &&
      squares[b] === squares[c] &&
      squares[c] &&
      squares[c] === squares[a]
    )
      return squares[a]
  }
  if (squares.every((square) => square)) {
    return "draw"
  } else {
    return null
  }
}

export default Game
