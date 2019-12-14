var schema = new Schema(
    {
        name: {
            type: String
        },
        ownerName: {
            type: String
        },
        sponsorType: {
            type: String
        },
        logo: {
            type: String
        },
        link: {
            type: String
        },
        order: {
            type: Number
        },
        active: {
            type: Boolean
        },
        typeSponsor: {
            type: String,
            enum: ["Big", "Medium", "Small"]
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Sponsor", schema)
