export class TimeUtil {
  /**
   * Returns the time taken to execute a function in milliseconds.
   * @param callback The function to be executed
   * @returns A promise that resolves to the time taken in milliseconds
   */
  static getTimeExecutionFor(callback: () => Promise<void>): Promise<number> {
    return new Promise((resolve) => {
      // Use bigint for high-resolution time measurement
      const startTime = process.hrtime.bigint();
      callback().then(() => {
        const endTime = process.hrtime.bigint();
        const durationInNs = endTime - startTime;
        const durationInMs = Number(durationInNs) / 1_000_000; // Convert nanoseconds to milliseconds
        resolve(durationInMs);
      });
    });
  }
}