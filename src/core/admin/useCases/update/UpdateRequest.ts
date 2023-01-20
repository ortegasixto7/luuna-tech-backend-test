export class UpdateRequest {
  id: string = '';
  name: string = '';
  email: string = '';
  userId: string = '';

  constructor(request: any) {
    this.id = request.id ?? '';
    this.name = request.name ?? '';
    this.email = request.email ?? '';
    this.userId = request.userId ?? '';
  }
}
