import { Injectable } from '@nestjs/common';
import { OtpData } from './interfaces';

@Injectable()
export class OtpService {
  private otpStorage: Map<string, OtpData> = new Map();

  private generateOtp(length = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  generateOtpWithExpiry(minutes: number): OtpData {
    const otp = this.generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return { otp, expiresAt };
  }

  storeOtp(email: string, otpData: OtpData): void {
    this.otpStorage.set(email, otpData);
  }

  getOtp(email: string): OtpData | undefined {
    return this.otpStorage.get(email);
  }

  validateOtp(email: string, otp: string): boolean {
    const storedOtpData = this.getOtp(email);
    if (!storedOtpData) return false;

    const isExpired = new Date() > storedOtpData.expiresAt;
    return !isExpired && storedOtpData.otp === otp;
  }
}
