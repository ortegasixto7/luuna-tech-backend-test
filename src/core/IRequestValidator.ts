export interface IRequestValidator<T> {
  validate(request: T): void;
}
