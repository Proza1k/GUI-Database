export enum Status {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type ResponseServiceData<T> = {
  payload?: T;
  message?: string;
  status?: Status;
};
