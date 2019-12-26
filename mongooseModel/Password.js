var schema = new Schema(
    {
        name: { type: String },
        key: { type: String }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Password", schema)
