var schema = new Schema(
    {
        playerCount: { type: Number }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Setting", schema)
