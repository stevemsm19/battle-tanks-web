import { Player } from '../models/player.model';
import { ChatMessage } from '../../features/game/services/game.service';

export const simulateIncomingPlayers = (
  mockPlayers: Player[],
  callback: (player: Player) => void,
) => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < mockPlayers.length) {
      callback(mockPlayers[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 2000);
};

export const simulateIncomingMessages = (
  mockMessages: ChatMessage[],
  addMessageCallback: (msg: ChatMessage) => void,
) => {
  let index = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      if (index < mockMessages.length) {
        addMessageCallback(mockMessages[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2500);
  }, 1000);
};
