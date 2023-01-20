export class UpdateRequest {
  id: string = '';
  sku: string = '';
  name: string = '';
  price: number = 0;
  brand: string = '';
  userId: string = '';

  constructor(request: any) {
    this.id = request.id ?? '';
    this.sku = request.sku ?? '';
    this.name = request.name ?? '';
    this.price = request.price ?? 0;
    this.brand = request.brand ?? '';
    this.userId = request.userId ?? '';
  }
}
