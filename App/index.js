// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, Alert } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 800;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const generateInitialSnake = () => [
  { x: 6, y: 7 },
  { x: 5, y: 7 },
  { x: 4, y: 7 }
];

const generateRandomFood = (excludePositions) => {
  let food;
  while (!food || excludePositions.some(pos => pos.x === food.x && pos.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * WIDTH / CELL_SIZE),
      y: Math.floor(Math.random() * HEIGHT / CELL_SIZE)
    };
  }
  return food;
};

export default function App() {
  const [snake, setSnake] = useState(generateInitialSnake);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [food, setFood] = useState(generateRandomFood(snake));
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!isGameOver) {
      const intervalID = setInterval(moveSnake, 200);
      return () => clearInterval(intervalID);
    }
  }, [snake, direction, isGameOver]);

  const moveSnake = () => {
    const snakeCopy = [...snake];
    const head = { ...snake[0], x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    if (snakeCopy.some(cell => cell.x === head.x && cell.y === head.y) ||
        head.x < 0 || head.x >= WIDTH / CELL_SIZE || head.y < 0 || head.y >= HEIGHT / CELL_SIZE) {
      setIsGameOver(true);
      Alert.alert('Game Over', 'You lost!');
      return;
    }

    snakeCopy.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      setFood(generateRandomFood(snakeCopy));
    } else {
      snakeCopy.pop();
    }
    setSnake(snakeCopy);
  };

  const handleTap = (dx, dy) => {
    if (!isGameOver) {
      const newDirection = { x: dx, y: dy };
      if (-newDirection.x !== direction.x && -newDirection.y !== direction.y) {
        setDirection(newDirection);
      }
    }
  };

  const resetGame = () => {
    setSnake(generateInitialSnake);
    setDirection(DIRECTIONS.RIGHT);
    setFood(generateRandomFood(generateInitialSnake()));
    setIsGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => handleTap(-1, 0)} style={styles.leftHalf}>
        <View />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => handleTap(1, 0)} style={styles.rightHalf}>
        <View />
      </TouchableWithoutFeedback>
      <View style={styles.board}>
        {snake.map((cell, index) => (
          <View key={index} style={[styles.snakeCell, { top: cell.y * CELL_SIZE, left: cell.x * CELL_SIZE }]} />
        ))}
        <View style={[styles.foodCell, { top: food.y * CELL_SIZE, left: food.x * CELL_SIZE }]} />
      </View>
      {isGameOver && <Button title="Restart" onPress={resetGame} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  board: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  snakeCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'green',
    position: 'absolute',
  },
  foodCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'red',
    position: 'absolute',
  },
  leftHalf: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    left: 0,
  },
  rightHalf: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    right: 0,
  },
});