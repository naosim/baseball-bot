export class FetchDeno {
  static async get(url: string): Promise<string> {
    return await (await fetch(url)).text()
  }
}
