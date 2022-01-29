import { IsNotEmpty, IsPhoneNumber } from 'class-validator'

export class UpdatePlayerDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly playerPhoneNumber: string
  
  @IsNotEmpty()
  readonly name: string
}