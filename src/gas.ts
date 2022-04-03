import {BasballBot} from "./baseballbot.ts"
import { FetchGas } from "./infra/gas/FetchGas.ts";
declare const GoogleChatClient: any;
declare const roomNameConvertMapDefault: string;

function run(dummy: boolean) {
  if(dummy) {
    return;
  }

  const now = new Date();
  // 実行時刻
  const runnableHours = [10, 17, 18, 19, 20, 21, 22].reduce((memo, v) => {memo[v] = true; return memo}, {} as {[key:number]:boolean});
  if(!runnableHours[now.getHours()]) {
    // return;
  }

  const chatPost = function(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log(text);
        // const spaceName = "残業スタジアム"
        // new GoogleChatClient(roomNameConvertMapDefault).post(spaceName, text)
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }
  const context = {
    fetchGet: FetchGas.get,
    chatPost,
    now
  }
  const basballBot = new BasballBot();
  basballBot.run(context).then(() => {}).catch(e => { throw e });
}
run(true);