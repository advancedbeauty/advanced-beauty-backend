import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      'detail':'This is the rest api backend for advanced beauty, created by none other than Diwakar Jha.',
      'created by': 'Diwakar Jha',
      'contact diwakar':'diwakarjha.vercel.app',
    };
  }
}
