import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema({
    dateTimeChallenge: { type: Date },
    stats: { type: String },
    dateTimeSolicitation: { type: Date },
    dateTimeResponse: { type: Date },
    requester: {type: mongoose.Schema.Types.ObjectId, ref: "Player"},
    category: {type: String },
    players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player"
    }],
    match: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Match" 
    },    
}, {timestamps: true, collection: 'challenges' })
