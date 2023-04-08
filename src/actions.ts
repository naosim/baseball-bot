// actions用のエントリーポイント
import {BasballBot} from "./domain/baseballbot"
import { FetchDeno } from "./infra/deno/fetchDeno";
declare var fetch: any;

async function run() {
  const url = process.env.GOOGLE_CHAT_URL;
  const chatPost = async function(text: string) {
    // 送信内容を生成
    var message = {'text' : text/*.split("\n").join("\\n")*/}
    var options = {
        'method': 'POST',
        'headers' : {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        'body':JSON.stringify(message)
    };
 
    // 送信を実行
    var result = fetch(url, options);
  }
  const context = {
    fetchGet: FetchDeno.get,
    chatPost,
    now: new Date()
  }
  const basballBot = new BasballBot();
  await basballBot.run(context);
}

run();