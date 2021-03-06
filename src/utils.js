export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export function fate({cell, x, y, board, getEmo}) {
  const living = livingNeighbors(x, y, board);
  const neighbors = living.length;

  const averageHappiness = getAverageHappiness(living);
  
  if(cell.age) {
    const nextEmo = getEmo(cell, averageHappiness);

    return neighbors === 2 || neighbors === 3 ? 
      ({
        ...cell, 
        age: cell.age + 1, 
        emo: nextEmo
      }) : 
      ({...cell, age: 0});
  } else {
    return neighbors === 3 ? 
      ({
        ...cell, 
        age: 1, 
        emo: getRandomIntInclusive(0, 1) ? averageHappiness : getRandomIntInclusive(1, 10)
      }) : ({
        ...cell, 
        age: 0
      });
  }
}

export function livingNeighbors(x, y, board) {
  let neighbors = [];
  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      if(i === 0 && j === 0) {
        // This is the cell, do nothing
      } else {
        let row = y + i, col = x + j;
        // Check for out of bounds and if so, 
        // use index at end or beginning instead
        row = row < 0 ? board.length - 1 : row;
        row = row > board.length - 1 ? 0 : row;
        col = col < 0 ? board[row].length - 1 : col;
        col = col > board[row].length - 1 ? 0 : col;
        // Check for life
        if(board[row][col].age) {
          // Increase neighbor count
          neighbors.push(board[row][col]);
        }
      }
    }
  }
  return neighbors;
}

function getAverageHappiness(living) {
	return Math.round(living.reduce(
		(total, {emo}) => 
		  emo + total
		, 0) / living.length);
}