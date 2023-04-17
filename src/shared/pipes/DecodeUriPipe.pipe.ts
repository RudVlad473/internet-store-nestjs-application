import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DecodeUriPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return decodeURI(value);
  }
}
