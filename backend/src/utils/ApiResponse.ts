import { Res } from '@/types/express';

export class ApiResponse {
  status?: number;
  message: string;
  data?: object;

  constructor(message: string, data?: any, status?: number) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  success(res: Res) {
    return res
      .status(this.status || 200)
      .json({ success: true, message: this.message, data: this.data });
  }

  error(res: Res) {
    const error = new Error(this.message);
    return res
      .status(this.status || 500)
      .json({ success: false, message: this.message, stack: error.stack });
  }
}