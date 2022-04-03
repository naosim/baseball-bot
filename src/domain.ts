export type Game = {
  status: string;
  match: {first: string, second: string};
  detail: {first: GameDetail, second: GameDetail};
  homerun: string[]
}

export type GameDetail = {
  team: string;
  score: string;// 全角数字
  pitchers: string[];// 継投
}