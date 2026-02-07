import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { WaitingRoomService } from '../../waiting-room/services/waiting-room.service';

export interface ChatMessage {
  senderId: string;
  sender: string;
  text: string;
  time: string;
}

type ChatState = {
  messages: ChatMessage[];
};

const initialState: ChatState = {
  messages: [],
};

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setMessages(messages: ChatMessage[]) {
      patchState(store, { messages });
    },
    addMessage(message: ChatMessage) {
      patchState(store, { messages: [...store.messages(), message] });
    },
  })),
);
