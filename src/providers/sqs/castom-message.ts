import { Message } from '@providers/sqs/sqs.types';

/**
 * @example
 * ```typescript
 * const message = new CustomMessage()
 *  .setBody({ test: 'yay' })
 *  .setDelaySeconds(6);
 *  ```
 *
 *  ```typescript
 *  CustomMessage.toJSON(message);
 *  ```
 */
export class CustomMessage {
  message: Message | {};

  constructor() {
    this.message = {};
  }

  static toJSON(message: Message) {
    try {
      return {
        ...message,
        body: JSON.parse(message.body),
      };
    } catch (error) {
      throw new Error(`Error parsing message body: ${error.message}`);
    }
  }

  setBody(body: any) {
    this.message = {
      ...this.message,
      body,
    };

    return this;
  }

  setDelaySeconds(delaySeconds: number) {
    this.message = {
      ...this.message,
      delaySeconds,
    };

    return this;
  }
}


new CustomMessage()
