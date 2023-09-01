import { HttpException, HttpStatus } from '@nestjs/common';

interface IRedirectType {
  userInfo: {
    type: 'github' | 'google';
    id: string;
    userName: string;
    avatar: string;
  };
}

export class RedirectException extends HttpException {
  constructor(public readonly userInfo: IRedirectType) {
    super('RedirectException', HttpStatus.MOVED_PERMANENTLY);
  }
}
