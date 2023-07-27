import { CoreOutput } from './coreoutput.dto';
import { IsOptional, IsString } from 'class-validator';

export class KakaoLoginAuthOutputDto extends CoreOutput {
  @IsOptional()
  @IsString()
  accessToken?: string;
}