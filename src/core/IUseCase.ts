export interface IUseCaseCommand<T> {
  execute(request: T): Promise<void>;
}

export interface IUseCaseQuery<T> {
  execute(request: T): Promise<any>;
}
