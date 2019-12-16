var schema = new Schema(
    {
        message: { type: String }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Setting", schema)
