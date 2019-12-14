var schema = new Schema(
    {
        folderName: {
            type: String
        },
        title: {
            type: String
        },
        mediaLink: {
            type: String
        },
        mediaType: {
            type: String,
            enum: ["Photo", "Video"]
        },
        eventDate: {
            type: Date
        },
        videoThumbnail: {
            type: String
        },
        order: {
            type: Number
        },
        status: Boolean
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Gallery", schema)
