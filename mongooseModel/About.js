var schema = new Schema(
    {
        content1: {
            type: String
        },
        content2: {
            type: String
        },
        team: [
            {
                image: String,
                name: String,
                designation: String,
                description: String,
                status: Boolean
            }
        ]
    },
    {
        timestamps: true
    }
)
export default mongoose.model("About", schema)
