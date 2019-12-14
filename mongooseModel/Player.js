var schema = new Schema(
    {
        firstName: { type: String },
        middleName: { type: String },
        surname: { type: String },
        fullName: {
            type: String
        },
        email: {
            type: String
        },
        mobile: {
            type: Number
        },
        age: {
            type: Number
        },
        keyRole: {
            type: String,
            enum: ["Batsman", "Bowler", "All rounder"]
        },
        battingType: {
            type: String,
            enum: ["Right Hand", "Left Hand"]
        },
        bowlingType: {
            type: String,
            enum: [
                "Right Arm Medium Pace",
                "Left Arm Medium Pace",
                "Left Arm Spinner",
                "Off Spinner",
                "Leg Spinner",
                "None"
            ]
        },
        isWicketkeeper: {
            type: Boolean
        },
        photograph: {
            type: String
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team"
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Player", schema)
