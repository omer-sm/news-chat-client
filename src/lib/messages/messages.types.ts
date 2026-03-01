interface Reporter {
  id: number;
  reporter: {
    filePaths: {
      [x: string]: string;
    };
    id: number;
    image: string;
    name: string;
    reporterID: number;
    status: number;
    topicID: number;
  };
}

interface UpdatedDate {
  date: number;
  day: number;
  hours: number;
  minutes: number;
  month: number;
  seconds: number;
  time: number;
  timezoneOffset: number;
  year: number;
}

interface MediaElement {
  autoId: number;
  filePaths: {
    [x: string]: string;
  };
  id: number;
  legthInSeconds: number;
  link1: string;
  link2?: string;
  link3?: string;
  linkOrder: number;
  mediaContent: string;
  messageId: number;
  thumbnail: string;
  typeId: number;
}

interface AckMessage {
  t: 'c';
  d: {
    d: {
      ts: number;
      v: string;
      h: string;
    };
  };
}

export interface MessageContent {
  anUpdate: boolean;
  current: boolean;
  id: number;
  important: boolean;
  messageContent?: string;
  messageID: number;
  pushSent: boolean;
  statusID: number;
  updatePublishTime: boolean | number;
  reporter: Reporter;
  updatedDate: UpdatedDate;
  medias?: { [x: string]: MediaElement };
}

export interface UpdateMessage {
  t: 'd';
  d: {
    b: {
      d: MessageContent;
    };
  };
}

export interface HistoryMessage {
  t: 'd';
  d: {
    b: {
      d: { [K in `-${string}`]: MessageContent };
    };
  };
}

export type NewsMessage = HistoryMessage | UpdateMessage | AckMessage;
