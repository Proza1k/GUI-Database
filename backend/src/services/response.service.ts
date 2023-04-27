import { ResponseServiceData, Status } from 'src/types/response';

export class ResponseService {
  success<T>({ payload, message }: ResponseServiceData<T>) {
    return {
      status: Status.SUCCESS,
      payload,
      message,
    };
  }

  error<T>({ message }: ResponseServiceData<T>) {
    return {
      status: Status.ERROR,
      message,
    };
  }
}
