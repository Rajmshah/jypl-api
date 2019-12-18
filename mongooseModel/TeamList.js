var schema = new Schema(
    {
        name: { type: String }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("TeamList", schema)
