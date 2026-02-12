import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IsNotBlank } from 'src/validators/is-not-blank.decorator';

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  input: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotBlank({ each: true })
  steps: string[];
}
