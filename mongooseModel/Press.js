var schema = new Schema(
    {
        image: {
            type: String
        },
        title: {
            type: String
        },
        newsDate: {
            type: Date
        },
        description: {
            type: String
        },
        status: Boolean
    },
    {
        timestamps: true
    }
)
schema.plugin(MongoPaging.mongoosePlugin)
export default mongoose.model("Press", schema)
