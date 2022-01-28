import { Document } from "mongoose";

export interface Player extends Document {
  readonly _id: string
  readonly playerPhoneNumber: string
  readonly email: string
  name: string
  ranking: string
  rankingPosition: number
  photoUrl: string
}