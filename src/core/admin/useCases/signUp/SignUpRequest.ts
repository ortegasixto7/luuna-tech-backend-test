export class SignUpRequest {
  email: string = '';
  password: string = '';

  constructor(request: any) {
    this.email = request.email ?? '';
    this.password = request.password ?? '';
  }
}
