import { getRandomIntInclusive } from './utils.js'

class EmotionSet {
  constructor(emotionArray) {
    this.emotions = emotionArray;
    this.maxEmotion = emotionArray.length - 1;
    this.minEmotion = 1;  // 0 will be dead

    this.getEmotion = this.getEmotion.bind(this);
  }

  getEmotion(cell, averageHappiness = 5) {
    // Average cell emotion with average emotion of neighbors
    let nextEmo = cell.emo ? 
      Math.round((cell.emo + (averageHappiness - cell.emo) / 4) / 2) : 5;
    nextEmo = Math.max(this.minEmotion, nextEmo);
    nextEmo = Math.min(this.maxEmotion, nextEmo);
    // A 50% chance of being influenced by peer group
    // maybe in the future this can be a function of age or personal characteristic
    nextEmo = getRandomIntInclusive(1, 2) === 1 ? nextEmo : cell.emo;
    // A 1 in 50 chance of just being random (sometime emoji have bad days and good ones)
    nextEmo = getRandomIntInclusive(1, 25) !== 1 ? nextEmo : getRandomIntInclusive(this.minEmotion, this.maxEmotion);
    return nextEmo;
  }
}

export default EmotionSet