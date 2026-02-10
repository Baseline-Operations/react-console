/**
 * Pong Game Example - Classic Pong clone with sound effects
 * Demonstrates: game loop, useInput hook, useTerminalDimensions, Bell API sounds
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  render,
  View,
  Text,
  Bell,
  StyleSheet,
  useInput,
  useTerminalDimensions,
} from '../src/index';

// Game constants
const PADDLE_HEIGHT = 4;
const BALL_SPEED = 1;
const PADDLE_SPEED = 1;
const AI_SPEED = 0.7;
const WINNING_SCORE = 5;

// Register game sounds
Bell.registerPattern('paddleHit', [
  { frequency: 400, duration: 50, waveform: 'square', volume: 0.3 },
]);

Bell.registerPattern('wallHit', [{ frequency: 300, duration: 30, waveform: 'sine', volume: 0.2 }]);

Bell.registerPattern('score', [
  { frequency: 600, duration: 100, waveform: 'sine', volume: 0.4 },
  { frequency: 800, duration: 150, delay: 50, waveform: 'sine', volume: 0.5 },
]);

Bell.registerPattern('gameOver', [
  { frequency: 400, duration: 200, waveform: 'square', volume: 0.4 },
  { frequency: 300, duration: 200, delay: 100, waveform: 'square', volume: 0.4 },
  { frequency: 200, duration: 400, delay: 100, waveform: 'square', volume: 0.5 },
]);

Bell.registerPattern('victory', [
  { frequency: 523, duration: 150, waveform: 'sine', volume: 0.4 },
  { frequency: 659, duration: 150, delay: 50, waveform: 'sine', volume: 0.4 },
  { frequency: 784, duration: 150, delay: 50, waveform: 'sine', volume: 0.4 },
  { frequency: 1047, duration: 300, delay: 50, waveform: 'sine', volume: 0.5 },
]);

Bell.registerPattern('start', [
  { frequency: 440, duration: 100, waveform: 'sine', volume: 0.3 },
  { frequency: 550, duration: 100, delay: 100, waveform: 'sine', volume: 0.3 },
  { frequency: 660, duration: 150, delay: 100, waveform: 'sine', volume: 0.4 },
]);

interface GameState {
  ballX: number;
  ballY: number;
  ballDX: number;
  ballDY: number;
  paddle1Y: number;
  paddle2Y: number;
  score1: number;
  score2: number;
  gameStarted: boolean;
  gameOver: boolean;
  winner: 'player' | 'cpu' | null;
  paused: boolean;
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
  },
  title: {
    color: 'cyan',
    bold: true,
  },
  score: {
    color: 'yellow',
    bold: true,
  },
  gameArea: {
    border: true,
    borderStyle: 'single',
    borderColor: 'gray',
  },
  instructions: {
    color: 'gray',
    dim: true,
  },
  modalBox: {
    border: true,
    borderStyle: 'double',
    borderColor: 'cyan',
    padding: 1,
    backgroundColor: 'black',
  },
  modalTitle: {
    color: 'cyan',
    bold: true,
  },
  modalText: {
    color: 'white',
  },
  controlKey: {
    color: 'yellow',
    bold: true,
  },
  controlDesc: {
    color: 'gray',
  },
});

function PongGame() {
  // Get terminal dimensions for responsive sizing
  const dimensions = useTerminalDimensions();

  // Calculate game dimensions - fill the screen
  const gameWidth = useMemo(() => {
    // Terminal width minus borders (2 chars) and small buffer (1 char)
    // Total line width = gameWidth + 2 (for │ on each side)
    return Math.max(30, dimensions.columns - 2);
  }, [dimensions.columns]);

  const gameHeight = useMemo(() => {
    // Terminal height minus: header (1), top border (1), bottom border (1), footer (1), buffer (1)
    return Math.max(8, dimensions.rows - 5);
  }, [dimensions.rows]);

  // Create initial state based on game dimensions
  const createInitialState = useCallback(
    (width: number, height: number): GameState => ({
      ballX: Math.floor(width / 2),
      ballY: Math.floor(height / 2),
      ballDX: BALL_SPEED,
      ballDY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      paddle1Y: Math.floor(height / 2 - PADDLE_HEIGHT / 2),
      paddle2Y: Math.floor(height / 2 - PADDLE_HEIGHT / 2),
      score1: 0,
      score2: 0,
      gameStarted: false,
      gameOver: false,
      winner: null,
      paused: false,
    }),
    []
  );

  const [game, setGame] = useState<GameState>(() => createInitialState(gameWidth, gameHeight));
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Track which keys are currently held down
  const keysHeld = useRef<{ up: boolean; down: boolean }>({ up: false, down: false });

  // Update game state when dimensions change (only if not started)
  useEffect(() => {
    if (!game.gameStarted) {
      setGame(createInitialState(gameWidth, gameHeight));
    }
  }, [gameWidth, gameHeight, game.gameStarted, createInitialState]);

  // Reset ball to center
  const resetBall = useCallback(
    (width: number, height: number) => ({
      ballX: Math.floor(width / 2),
      ballY: Math.floor(height / 2),
      ballDX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      ballDY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    }),
    []
  );

  // Start game
  const startGame = useCallback(() => {
    Bell.playPattern('start');
    setGame({
      ...createInitialState(gameWidth, gameHeight),
      gameStarted: true,
      ...resetBall(gameWidth, gameHeight),
    });
  }, [gameWidth, gameHeight, createInitialState, resetBall]);

  // Toggle pause
  const togglePause = useCallback(() => {
    setGame((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  // Handle keyboard input using the useInput hook
  useInput((input, key) => {
    // Track key held state for continuous movement
    if (key.upArrow) {
      keysHeld.current.up = true;
      // Release after a delay if no repeat
      setTimeout(() => {
        keysHeld.current.up = false;
      }, 150);
    }
    if (key.downArrow) {
      keysHeld.current.down = true;
      setTimeout(() => {
        keysHeld.current.down = false;
      }, 150);
    }

    // Handle space for start/pause
    if (key.char === ' ' || input === ' ') {
      if (!game.gameStarted || game.gameOver) {
        startGame();
      } else {
        togglePause();
      }
    }

    // Handle quit
    if (input === 'q' || input === 'Q') {
      if (game.gameStarted && !game.gameOver) {
        setGame(createInitialState(gameWidth, gameHeight));
      }
    }

    // Handle escape - quit entirely or go back to menu
    if (key.escape) {
      setGame(createInitialState(gameWidth, gameHeight));
    }
  });

  // Game loop - runs at ~60fps
  useEffect(() => {
    if (!game.gameStarted || game.gameOver || game.paused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setGame((prev) => {
        if (!prev.gameStarted || prev.gameOver || prev.paused) {
          return prev;
        }

        let { ballX, ballY, ballDX, ballDY, paddle1Y, paddle2Y, score1, score2 } = prev;

        // Move player paddle based on held keys
        if (keysHeld.current.up && paddle1Y > 0) {
          paddle1Y -= PADDLE_SPEED;
        }
        if (keysHeld.current.down && paddle1Y < gameHeight - PADDLE_HEIGHT) {
          paddle1Y += PADDLE_SPEED;
        }

        // AI paddle movement
        const paddle2Center = paddle2Y + PADDLE_HEIGHT / 2;
        if (ballDX > 0) {
          if (paddle2Center < ballY - 1 && paddle2Y < gameHeight - PADDLE_HEIGHT) {
            paddle2Y += AI_SPEED;
          } else if (paddle2Center > ballY + 1 && paddle2Y > 0) {
            paddle2Y -= AI_SPEED;
          }
        }

        // Move ball
        ballX += ballDX;
        ballY += ballDY;

        // Ball collision with top/bottom walls
        if (ballY <= 0 || ballY >= gameHeight - 1) {
          ballDY = -ballDY;
          ballY = Math.max(0, Math.min(gameHeight - 1, ballY));
          Bell.playPattern('wallHit');
        }

        // Ball collision with paddle 1 (left/player)
        if (ballX <= 2 && ballY >= paddle1Y && ballY <= paddle1Y + PADDLE_HEIGHT && ballDX < 0) {
          ballDX = -ballDX;
          ballX = 3;
          const hitPos = (ballY - paddle1Y) / PADDLE_HEIGHT;
          ballDY = (hitPos - 0.5) * 2;
          Bell.playPattern('paddleHit');
        }

        // Ball collision with paddle 2 (right/AI)
        if (
          ballX >= gameWidth - 3 &&
          ballY >= paddle2Y &&
          ballY <= paddle2Y + PADDLE_HEIGHT &&
          ballDX > 0
        ) {
          ballDX = -ballDX;
          ballX = gameWidth - 4;
          const hitPos = (ballY - paddle2Y) / PADDLE_HEIGHT;
          ballDY = (hitPos - 0.5) * 2;
          Bell.playPattern('paddleHit');
        }

        // Score detection
        let newScore1 = score1;
        let newScore2 = score2;
        let resetBallState: Partial<GameState> = {};

        if (ballX <= 0) {
          newScore2 = score2 + 1;
          Bell.playPattern('score');
          resetBallState = {
            ballX: Math.floor(gameWidth / 2),
            ballY: Math.floor(gameHeight / 2),
            ballDX: BALL_SPEED,
            ballDY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
          };
        } else if (ballX >= gameWidth - 1) {
          newScore1 = score1 + 1;
          Bell.playPattern('score');
          resetBallState = {
            ballX: Math.floor(gameWidth / 2),
            ballY: Math.floor(gameHeight / 2),
            ballDX: -BALL_SPEED,
            ballDY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
          };
        }

        // Check for game over
        let gameOver = false;
        let winner: 'player' | 'cpu' | null = null;

        if (newScore1 >= WINNING_SCORE) {
          gameOver = true;
          winner = 'player';
          Bell.playPattern('victory');
        } else if (newScore2 >= WINNING_SCORE) {
          gameOver = true;
          winner = 'cpu';
          Bell.playPattern('gameOver');
        }

        return {
          ...prev,
          ballX: resetBallState.ballX ?? ballX,
          ballY: resetBallState.ballY ?? ballY,
          ballDX: resetBallState.ballDX ?? ballDX,
          ballDY: resetBallState.ballDY ?? ballDY,
          paddle1Y: Math.round(paddle1Y),
          paddle2Y: Math.round(paddle2Y),
          score1: newScore1,
          score2: newScore2,
          gameOver,
          winner,
        };
      });
    }, 60);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [game.gameStarted, game.gameOver, game.paused, gameWidth, gameHeight]);

  // Render game area with borders included in text (for precise width control)
  const renderGameArea = () => {
    const rows: string[] = [];
    const showModal = !game.gameStarted || game.gameOver || game.paused;

    // Modal content - fixed width of 30 chars
    let modalLines: string[] = [];
    const modalWidth = 30;

    if (!game.gameStarted) {
      modalLines = [
        '╔════════════════════════════╗',
        '║           PONG             ║',
        '║                            ║',
        '║     Press SPACE to start   ║',
        '║                            ║',
        '║      First to 5 wins!      ║',
        '╚════════════════════════════╝',
      ];
    } else if (game.gameOver) {
      const winMsg = game.winner === 'player' ? 'YOU WIN!' : 'CPU WINS';
      modalLines = [
        '╔════════════════════════════╗',
        '║         GAME OVER          ║',
        '║                            ║',
        `║${winMsg.padStart(14 + winMsg.length / 2).padEnd(28)}║`,
        '║                            ║',
        '║    SPACE to play again     ║',
        '║    Q to quit               ║',
        '╚════════════════════════════╝',
      ];
    } else if (game.paused) {
      modalLines = [
        '╔════════════════════════════╗',
        '║          PAUSED            ║',
        '╠════════════════════════════╣',
        '║  Controls:                 ║',
        '║  ↑/↓    Move paddle        ║',
        '║  SPACE  Pause/Resume       ║',
        '║  Q      Quit to menu       ║',
        '║  ESC    Quit game          ║',
        '╠════════════════════════════╣',
        '║     SPACE to resume        ║',
        '╚════════════════════════════╝',
      ];
    }

    const modalStartY = Math.floor((gameHeight - modalLines.length) / 2);
    const modalStartX = Math.floor((gameWidth - modalWidth) / 2);

    // Top border
    rows.push('┌' + '─'.repeat(gameWidth) + '┐');

    for (let y = 0; y < gameHeight; y++) {
      let row = '│'; // Left border

      // Check if this row should show modal
      const modalLineIndex = y - modalStartY;
      const showModalLine = showModal && modalLineIndex >= 0 && modalLineIndex < modalLines.length;

      for (let x = 0; x < gameWidth; x++) {
        // Check if we're in the modal area
        if (showModalLine && x >= modalStartX && x < modalStartX + modalWidth) {
          const modalCharIndex = x - modalStartX;
          const modalLine = modalLines[modalLineIndex] || '';
          row += modalLine[modalCharIndex] || ' ';
          continue;
        }

        // Normal game rendering
        const isPaddle1 = x === 1 && y >= game.paddle1Y && y < game.paddle1Y + PADDLE_HEIGHT;
        const isPaddle2 =
          x === gameWidth - 2 && y >= game.paddle2Y && y < game.paddle2Y + PADDLE_HEIGHT;
        const isBall = !showModal && Math.round(game.ballX) === x && Math.round(game.ballY) === y;
        const isCenterLine = x === Math.floor(gameWidth / 2) && y % 2 === 0;

        if (isPaddle1 || isPaddle2) {
          row += '█';
        } else if (isBall) {
          row += '●';
        } else if (isCenterLine) {
          row += '│';
        } else {
          row += ' ';
        }
      }
      row += '│'; // Right border
      rows.push(row);
    }

    // Bottom border
    rows.push('└' + '─'.repeat(gameWidth) + '┘');

    return rows;
  };

  return (
    <View style={styles.container}>
      {/* Header with scores on opposite sides - matches game board width */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: gameWidth + 2,
        }}
      >
        <Text>
          P1: <Text style={styles.score}>{game.score1}</Text>
        </Text>
        <Text style={styles.title}>
          PONG [{dimensions.columns}x{dimensions.rows}]
        </Text>
        <Text>
          CPU: <Text style={styles.score}>{game.score2}</Text>
        </Text>
      </View>

      {/* Game area with borders rendered as text */}
      <View>
        {renderGameArea().map((row, i) => (
          <Text key={i} style={{ color: 'gray' }}>
            {row}
          </Text>
        ))}
      </View>

      {/* Footer - only show when playing */}
      {game.gameStarted && !game.gameOver && !game.paused && (
        <Text style={styles.instructions}>↑↓ move | SPACE pause | Q quit</Text>
      )}
    </View>
  );
}

render(<PongGame />, { mode: 'interactive' });
