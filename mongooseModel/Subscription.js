var schema = new Schema(
    {
        email: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Subscription", schema)
