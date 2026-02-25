import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

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
    clearMessages() {
      patchState(store, { messages: [] });
    },
  })),
);
