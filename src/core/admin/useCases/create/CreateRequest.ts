export class CreateRequest {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(request: any) {
    this.name = request.name ?? '';
    this.email = request.email ?? '';
    this.password = request.password ?? '';
  }
}
