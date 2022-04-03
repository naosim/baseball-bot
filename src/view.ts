import {Game} from "./domain.ts"
export class View {
  static toText(games: Game[]): string {
    return games.map(View.gameToText).join("\n--\n")
  }

  static gameToText(game: Game) {
    return `
🌼🌼🌼${game.match.first} ${game.detail.first.score} - ${game.detail.second.score} ${game.match.second}🌼🌼🌼
${game.status}

⚾継投⚾
【${game.match.first}】${game.detail.first.pitchers.join(" ")}
【${game.match.second}】${game.detail.second.pitchers.join(" ")}

${game.homerun.length > 0 ? "🎉本塁打\n" + game.homerun.join('\n'): ""}
  `.trim()
  }
}
