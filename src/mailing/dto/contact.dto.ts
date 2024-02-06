import { EmailDto } from './email.dto';
import { IsPhoneNumber, IsString } from 'class-validator';

export class ContactDto extends EmailDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  message: string;
}
