import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator'

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly playerPhoneNumber: string
  
  @IsEmail()
  readonly email: string
  
  @IsNotEmpty()
  readonly name: string
}