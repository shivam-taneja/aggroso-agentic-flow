import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsNotBlank } from 'src/validators/is-not-blank.decorator';

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  @MaxLength(1000)
  input: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @IsNotBlank({ each: true })
  @MaxLength(300, { each: true })
  steps: string[];
}
