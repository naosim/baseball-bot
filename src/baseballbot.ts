import {Ymd, BaseballParser} from "./parser.ts"
import {View} from "./view.ts"

enum Target {
  today = "today",
  yesterday = "yesterday"
}

export type Context = {
  // fetch: Fetch,
  fetchGet: (url: string) => Promise<string>;
  chatPost: (text: string) => Promise<void>,
  now: Date
}

export class BasballBot {
  async run(context: Context) { // note: GASはクラスフィールドにバグがあるため、引数で渡す。
    // 実行時刻が午前なら前日のデータを取得する
    const target = context.now.getHours() < 13 ? Target.yesterday : Target.today;
    const ymd = getTargetYmd_(context.now, target);
    const url = BaseballParser.getUrl(ymd);
    const html = await context.fetchGet(url);
    const text = View.toText(BaseballParser.parseHtml(html))
    await context.chatPost(text);
  }
}

/**
 * 試合の対象日付を取る
 * @param {Date} now
 * @returns {string} yyyymmdd
 */
 function getTargetYmd_(now: Date, target: Target): Ymd {
   const date = new Date(now);// 副作用を消す
   if(target == Target.yesterday) {
    date.setDate(date.getDate() - 1) // 前日
   }

   const y = date.getFullYear();
   const m = `0${date.getMonth() + 1}`.slice(-2);
   const d = `0${date.getDate()}`.slice(-2);
   return `${y}${m}${d}` as Ymd;
}