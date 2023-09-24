export interface IError {
  message: string;
  type: 'success' | 'error';
}

export interface ErrorState {
  errors: IError[];
}
