import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDetails() {
    return {
      'detail':'This is the rest api backend for advanced beauty, created by none other than Diwakar Jha.',
      'created_by': 'Diwakar Jha',
      'contact_diwakar':'diwakarjha.vercel.app',
    };
  }
}
