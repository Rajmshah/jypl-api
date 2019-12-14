var schema = new Schema(
    {
        username: { type: String, unique: true },
        password: { type: String },
        email: { type: String },
        mobile: { type: Number },
        accessToken: [
            {
                token: {
                    type: String,
                    index: true
                },
                expiry: {
                    type: Date
                }
            }
        ]
    },
    {
        timestamps: true
    }
)
export default mongoose.model("User", schema)
