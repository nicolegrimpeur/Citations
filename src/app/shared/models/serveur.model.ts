class messageModel {
  date: string;
  message: string;
}

export class ServeurModel {
  serveur: string;
  messages: Array<messageModel>;
}
