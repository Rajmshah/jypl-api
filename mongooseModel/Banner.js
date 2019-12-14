var schema = new Schema(
    {
        image: String,
        title: String,
        pageName: {
            type: String,
            enum: [
                "Club",
                "Master Class",
                "Academy",
                "News & Update",
                "Gallery",
                "About Us",
                "Contact Us"
            ]
        },
        status: Boolean,
        linkType: {
            type: String,
            enum: ["Internal", "External"]
        },
        link: String
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Banner", schema)
