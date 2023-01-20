export class GetRequest {
  id: string = '';
  ipAddress: string = '';

  constructor(request: any) {
    this.id = request.id ?? '';
    this.ipAddress = request.ipAddress ?? '0.0.0.0';
  }
}
