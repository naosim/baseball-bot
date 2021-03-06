import {Game} from "./domain.ts"
export class View {
  static toText(games: Game[]): string {
    return games.map(View.gameToText).join("\n--\n")
  }

  static gameToText(game: Game) {
    return `
πΌπΌπΌ${game.match.first} ${game.detail.first.score} - ${game.detail.second.score} ${game.match.second}πΌπΌπΌ
${game.status}

βΎηΆζβΎ
γ${game.match.first}γ${game.detail.first.pitchers.join(" ")}
γ${game.match.second}γ${game.detail.second.pitchers.join(" ")}

${game.homerun.length > 0 ? "πζ¬ε‘ζ\n" + game.homerun.join('\n'): ""}
  `.trim()
  }
}
