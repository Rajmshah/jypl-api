var schema = new Schema(
    {
        banner: [
            {
                image: String,
                title: String,
                linkType: String,
                link: String,
                status: Boolean
            }
        ],
        adBlock: [
            {
                image: String,
                title: String,
                linkType: String,
                link: String,
                status: Boolean
            }
        ],
        gallery: [
            {
                image: String,
                imageType: {
                    type: String,
                    enum: [
                        "Image 285 x 300",
                        "Image 570 x 300",
                        "Image 570 x 600"
                    ]
                },
                status: Boolean
            }
        ],
        content1: String,
        content2: String
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Homepage", schema)
