import { Schema } from "mongoose"

var schema = new Schema(
    {
        name: { type: String, unique: true },
        village: {
            type: String
        },
        logo: {
            type: String
        },
        description: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Team", schema)
