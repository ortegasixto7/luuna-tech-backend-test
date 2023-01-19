export class DeleteRequest {
  id: string = '';
  userId: string = '';

  constructor(request: any) {
    this.id = request.id ?? '';
    this.userId = request.userId ?? '';
  }
}
