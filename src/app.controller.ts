import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './iam/authorization/decorators/roles.decorator';
import { Role } from './users/enums/role.enum';

//TODO: just example of swagger JWT-auth - need to be modified
@ApiBearerAuth('JWT-auth')
@Roles(Role.Admin)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
