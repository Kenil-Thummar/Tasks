/*
https://docs.nestjs.com/guards#guards
*/

import { AuthGuard } from '@nestjs/passport';

export class guard extends AuthGuard("jwt") {
  constructor() { super() }
}
