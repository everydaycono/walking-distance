import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      useFactory: async () => ({
        transport: {
          host: process.env.SMTP_MAIL_SERVICE_HOST,
          secure: true,
          auth: {
            user: process.env.SMTP_MAIL_SERVICE_USER,
            pass: process.env.SMTP_MAIL_SERVICE_PASS
          }
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>'
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new PugAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true
          }
        }
      })
    })
  ],
  providers: [MailService],
  exports: [MailService] // 👈 export for DI
})
export class MailModule {}
