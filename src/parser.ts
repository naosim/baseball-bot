import {Game} from "./domain.ts"

// ここはhtml依存モリモリでOK

declare const YmdNominality: unique symbol
export type Ymd = string & { [YmdNominality]: never }

export class BaseballParser {
  static getUrl(ymd: Ymd): string {
    // スクレイピング先のURL
    return `https://www.nikkansports.com/baseball/professional/score/${ymd.slice(0, 4)}/pf-score-${ymd}.html`;
  }
  static parseHtml(html: string): Game[] {
    return html.split('<div class="scoreBox">').slice(1).map(BaseballParser.parseGame)
  }
  static parseGame(divRawText: string): Game {
    divRawText = divRawText.split("<!--/NSCORE-LINK-->")[0];
    const status = divRawText.split("<h5>")[1].split("</h5>")[0].replace('<span class="time">&nbsp;', '').replace('</span>', '');
    const teams = divRawText.split('<td class="team">').slice(1).map(v => v.split('</td>')[0].replaceAll('&nbsp;', ''))
    const scores = divRawText.split('<td class="totalScore">').slice(1).map(v => v.split('</td>')[0].replaceAll('&nbsp;', ''))
    var pitcherHomerun = [{dds:[] as string[]}, {dds:[]}, {dds:[]}]
    if(divRawText.split('<!--PITCHER-HOMERUN-->')[1].split('<dt>').slice(1).length > 0) {
      pitcherHomerun = divRawText.split('<!--PITCHER-HOMERUN-->')[1].split('<dt>').slice(1).map(v => {
        return {
          dt: v.split('</dt>')[0],
          dds: v.split('<dd>').slice(1).map(v => v.split('</dd>')[0])
        }
      })
    }
  
    return {
      status: status,
      match: {first: teams[0], second: teams[1]},
      detail: {
        first: {team: teams[0], score: scores[0], pitchers: pitcherHomerun[0].dds},
        second: {team: teams[1], score: scores[1], pitchers: pitcherHomerun[1].dds}
      },
      homerun: pitcherHomerun.length >= 3 ? pitcherHomerun[2].dds : []
    }
  }
}