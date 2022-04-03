class BaseballParser {
    static getUrl(ymd) {
        return `https://www.nikkansports.com/baseball/professional/score/${ymd.slice(0, 4)}/pf-score-${ymd}.html`;
    }
    static parseHtml(html) {
        return html.split('<div class="scoreBox">').slice(1).map(BaseballParser.parseGame);
    }
    static parseGame(divRawText) {
        divRawText = divRawText.split("<!--/NSCORE-LINK-->")[0];
        const status = divRawText.split("<h5>")[1].split("</h5>")[0].replace('<span class="time">&nbsp;', '').replace('</span>', '');
        const teams = divRawText.split('<td class="team">').slice(1).map((v)=>v.split('</td>')[0].replaceAll('&nbsp;', '')
        );
        const scores = divRawText.split('<td class="totalScore">').slice(1).map((v)=>v.split('</td>')[0].replaceAll('&nbsp;', '')
        );
        var pitcherHomerun = [
            {
                dds: []
            },
            {
                dds: []
            },
            {
                dds: []
            }
        ];
        if (divRawText.split('<!--PITCHER-HOMERUN-->')[1].split('<dt>').slice(1).length > 0) {
            pitcherHomerun = divRawText.split('<!--PITCHER-HOMERUN-->')[1].split('<dt>').slice(1).map((v)=>{
                return {
                    dt: v.split('</dt>')[0],
                    dds: v.split('<dd>').slice(1).map((v1)=>v1.split('</dd>')[0]
                    )
                };
            });
        }
        return {
            status: status,
            match: {
                first: teams[0],
                second: teams[1]
            },
            detail: {
                first: {
                    team: teams[0],
                    score: scores[0],
                    pitchers: pitcherHomerun[0].dds
                },
                second: {
                    team: teams[1],
                    score: scores[1],
                    pitchers: pitcherHomerun[1].dds
                }
            },
            homerun: pitcherHomerun.length >= 3 ? pitcherHomerun[2].dds : []
        };
    }
}
class View {
    static toText(games) {
        return games.map(View.gameToText).join("\n--\n");
    }
    static gameToText(game) {
        return `
🌼🌼🌼${game.match.first} ${game.detail.first.score} - ${game.detail.second.score} ${game.match.second}🌼🌼🌼
${game.status}

⚾継投⚾
【${game.match.first}】${game.detail.first.pitchers.join(" ")}
【${game.match.second}】${game.detail.second.pitchers.join(" ")}

${game.homerun.length > 0 ? "🎉本塁打\n" + game.homerun.join('\n') : ""}
  `.trim();
    }
}
var Target;
(function(Target1) {
    Target1["today"] = "today";
    Target1["yesterday"] = "yesterday";
})(Target || (Target = {
}));
class BasballBot {
    async run(context) {
        const target = context.now.getHours() < 13 ? Target.yesterday : Target.today;
        const ymd = getTargetYmd_(context.now, target);
        const url = BaseballParser.getUrl(ymd);
        const html = await context.fetchGet(url);
        const text = View.toText(BaseballParser.parseHtml(html));
        await context.chatPost(text);
    }
}
function getTargetYmd_(now, target) {
    const date = new Date(now);
    if (target == Target.yesterday) {
        date.setDate(date.getDate() - 1);
    }
    const y = date.getFullYear();
    const m = `0${date.getMonth() + 1}`.slice(-2);
    const d = `0${date.getDate()}`.slice(-2);
    return `${y}${m}${d}`;
}
class FetchGas {
    static async get(url) {
        return new Promise((resolve, reject)=>{
            try {
                resolve(UrlFetchApp.fetch(url).getContentText());
            } catch (e) {
                reject(e);
            }
        });
    }
}
function run(dummy) {
    if (dummy) {
        return;
    }
    const now = new Date();
    const runnableHours = [
        10,
        17,
        18,
        19,
        20,
        21,
        22
    ].reduce((memo, v)=>{
        memo[v] = true;
        return memo;
    }, {
    });
    if (!runnableHours[now.getHours()]) {
    }
    const chatPost = function(text) {
        return new Promise((resolve, reject)=>{
            try {
                console.log(text);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    };
    const context = {
        fetchGet: FetchGas.get,
        chatPost,
        now
    };
    const basballBot = new BasballBot();
    basballBot.run(context).then(()=>{
    }).catch((e)=>{
        throw e;
    });
}
run(true);
