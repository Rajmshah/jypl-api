var schema = new Schema(
    {
        eventName: {
            type: String
        },
        eventDate: {
            type: Date
        },
        venue: {
            type: String
        },
        image: {
            type: String
        },
        email: {
            type: String
        },
        mobile: {
            type: String
        },
        description: {
            type: String
        },
        eventStatus: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending"
        },
        status: Boolean,
        eventGallery: {
            type: Schema.Types.ObjectId,
            ref: "Gallery"
        }
    },
    {
        timestamps: true
    }
)
schema.plugin(MongoPaging.mongoosePlugin)
export default mongoose.model("Event", schema)
