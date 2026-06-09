import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  constructor() {}

  // Legacy client-side credential path is intentionally disabled.
  checkusernameandpassword(_uname: string, _pwd: string): boolean {
    return false;
  }
}
