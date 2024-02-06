import { IsString } from 'class-validator';

export class PathDto {
  @IsString()
  path: string;
}
