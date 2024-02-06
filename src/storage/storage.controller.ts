import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { StorageService } from './storage.service';
import { PathDto } from './dto/delete-file-path.dto';

@Auth(AuthType.None)
@Controller('storage')
export class StorageController {
  constructor(private readonly uploadService: StorageService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // ... Set of file validator instances here
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadFile(file);
    return { url };
  }

  @Post('delete')
  async deleteFile(@Body() path: PathDto) {
    await this.uploadService.delete(path.path);
  }

  @Get('files/meals')
  async getPublicMealsFiles() {
    return await this.uploadService.getPublicMealsFiles();
  }

  @Get('bucket')
  async getBucket() {
    return await this.uploadService.getBuckets();
  }
}
