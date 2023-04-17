import { handler } from 'pactum';

type Location = 'body' | 'json';

export function decodeUriHandler(
  valueToEncodeName: string,
  location: Location = 'json',
) {
  const handlerName = 'decodeUriHandler';

  handler.addCaptureHandler(handlerName, ({ res }) => {
    return decodeURI(res[location][valueToEncodeName]);
  });

  return `#${handlerName}`;
}
