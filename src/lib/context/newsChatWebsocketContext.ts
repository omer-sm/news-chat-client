import { type Signal, createContextId } from '@builder.io/qwik';
import type { MessageContent } from '../messages/messages.types';

export interface NewsChatWebsocketContextType {
  messages: Signal<MessageContent[]>;
  isWsConnected: Signal<boolean>;
  areMessagesLoaded: Signal<boolean>;
}

export const NewsChatWebsocketContext =
  createContextId<NewsChatWebsocketContextType>('newsChatWebsocket.context');
