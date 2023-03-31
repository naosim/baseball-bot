import {BasballBot} from "./baseballbot"
import { FetchDeno } from "./infra/deno/fetchDeno";

async function dryRun() {
  const chatPost = function(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log(text);
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }
  const context = {
    fetchGet: FetchDeno.get,
    chatPost,
    now: new Date()
  }
  const basballBot = new BasballBot();
  await basballBot.run(context);
}

dryRun();