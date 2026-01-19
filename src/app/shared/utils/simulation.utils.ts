import { Store } from '@ngrx/store';
import { Player } from '../../models/player.model';
import * as PlayerActions from '../../store/actions/player.actions';
import { ChatMessage } from '../../services/game.service';

export const simulateIncomingPlayers = (
  store: Store,
  mockPlayers: Player[],
) => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < mockPlayers.length) {
      store.dispatch(PlayerActions.addPlayer({ player: mockPlayers[index] }));
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
