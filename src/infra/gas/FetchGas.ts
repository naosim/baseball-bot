export declare const UrlFetchApp: any;

export class FetchGas {
  static async get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(UrlFetchApp.fetch(url).getContentText());
      } catch(e) {
        reject(e);
      }
    });
  }
}
