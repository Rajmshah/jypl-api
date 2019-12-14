var schema = new Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String
        },
        mobile: {
            type: Number
        },
        query: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("EnquiryForm", schema)
