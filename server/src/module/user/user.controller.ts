import {
  Controller,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Post,
  UploadedFiles,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor
} from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard/access-jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Patch('avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return this.userService.updateAvatar(
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }

  @UseGuards(JwtGuard)
  @Post('file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return file;
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('files')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 3 },
      { name: 'background', maxCount: 3 }
    ])
  )
  uploadFiles(
    @UploadedFiles(new ParseFilePipe())
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    }
  ) {
    return files;
  }
}
