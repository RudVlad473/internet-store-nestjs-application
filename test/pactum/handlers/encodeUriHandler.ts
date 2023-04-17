import { handler } from 'pactum';

type Location = 'body' | 'json';

export function encodeUriHandler(
  valueToEncodeName: string,
  location: Location = 'json',
) {
  const handlerName = 'encodeUriHandler';

  handler.addCaptureHandler(handlerName, ({ res }) => {
    return encodeURI(res[location][valueToEncodeName]);
  });

  return `#${handlerName}`;
}
