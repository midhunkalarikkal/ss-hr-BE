export class RandomStringGenerator {
  private readonly chars: string;

  constructor(
    chars: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  ) {
    this.chars = chars;
  }

  generate(length: number = 10): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * this.chars.length);
      result += this.chars.charAt(randomIndex);
    }
    return result;
  }
}
