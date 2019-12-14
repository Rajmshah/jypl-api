var schema = new Schema(
    {
        address: String,
        officeAddress: String,
        mapLink: String,
        mobile: [
            {
                name: String,
                phone: Number
            }
        ],
        email: [String],
        social: [
            {
                title: String,
                link: String
            }
        ]
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Contact", schema)
