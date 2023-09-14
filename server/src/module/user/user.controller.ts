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
  HttpStatus,
  Get,
  Req,
  Param
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor
} from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard/access-jwt.guard';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('👩🏻‍💻User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // update avatar
  @UseGuards(JwtGuard)
  @Patch('avatar')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
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

  // upload files
  @UseGuards(JwtGuard)
  @Post('file')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
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

  // upload multi files
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
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

  // get my articles
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my all articles' })
  @ApiBearerAuth()
  @Get('/my/articles')
  getMyArticles(@Req() req) {
    const userId = req.userInfo.id as string;
    return this.userService.getMyArticles(userId);
  }

  // get other person articles
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get other person articles' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get other person articles'
  })
  @Get('/:userId/articles')
  getOtherPersonArticles(@Param('userId') userId: string) {
    return this.userService.getOtherPersonArticles(userId);
  }
}
