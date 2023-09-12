import * as crypto from 'crypto';

class TokenEncryptor {
  /**
   * 무작위로 생성된 비밀 키 (32바이트, 256비트)
   * const encryptionKey = crypto.randomBytes(32).toString('hex');
   * 무작위로 생성된 초기화 벡터 (16바이트, 128비트)
   * const iv = crypto.randomBytes(16).toString('hex');
   */
  private accessIvHex = process.env.NEXT_PUBLIC_ACCESS_IV_HEX as string;
  private accessEncryptionKey = process.env
    .NEXT_PUBLIC_ACCESS_ENCRYPTION_KEY as string;

  private refreshIvHex = process.env.NEXT_PUBLIC_REFRESH_IV_HEX as string;
  private refreshEncryptionKey = process.env
    .NEXT_PUBLIC_REFRESH_ENCRYPTION_KEY as string;

  private encrypt(text: string, ivHex: string, encryptionKey: string): string {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(encryptionKey, 'hex'),
      Buffer.from(ivHex, 'hex')
    );
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  private decrypt(
    encryptedText: string,
    ivHex: string,
    encryptionKey: string
  ): string {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(encryptionKey, 'hex'),
      Buffer.from(ivHex, 'hex')
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
  accessEncrypt(value: string) {
    return this.encrypt(value, this.accessIvHex, this.accessEncryptionKey);
  }
  accessDecrypt(value: string) {
    return this.decrypt(value, this.accessIvHex, this.accessEncryptionKey);
  }
  refreshEncrypt(value: string) {
    return this.encrypt(value, this.refreshIvHex, this.refreshEncryptionKey);
  }
  refreshDecrypt(value: string) {
    return this.decrypt(value, this.refreshIvHex, this.refreshEncryptionKey);
  }
}

export const tokenEncryptor = new TokenEncryptor();
