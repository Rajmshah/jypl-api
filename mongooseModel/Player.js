var schema = new Schema(
    {
        incrementalId: {
            type: Number
        },
        playerId: {
            type: String
        },
        registrationDate: {
            type: Date
        },
        firstName: {
            type: String
        },
        middleName: {
            type: String
        },
        surname: {
            type: String
        },
        fullName: {
            type: String
        },
        email: {
            type: String
        },
        mobile: {
            type: Number
        },
        address: {
            type: String
        },
        dob: {
            type: Date
        },
        age: {
            type: Number
        },
        company: {
            name: {
                type: String
            },
            businessType: {
                type: String
            },
            designation: {
                type: String
            },
            relationship: {
                type: String
            },
            address: {
                type: String
            }
        },
        keyRole: {
            type: String,
            enum: ["Batsman", "Bowler", "All Rounder"]
        },
        battingType: {
            type: String,
            enum: ["Right Hand", "Left Hand"]
        },
        bowlingType: {
            type: String,
            enum: [
                "Right Arm Medium Pace",
                "Left Arm Medium Pace",
                "Left Arm Spin",
                "Right Arm Off Spin",
                "Right Arm Leg Spin",
                "None"
            ]
        },
        isWicketkeeper: {
            type: Boolean
        },
        hasPlayed: {
            type: Boolean
        },
        team: {
            type: String
        },
        shirtSize: {
            type: String
        },
        trouserSize: {
            type: String
        },
        trackLength: {
            type: String
        },
        jerseyName: {
            type: String
        },
        beOwner: {
            type: Boolean
        },
        beSponsor: {
            type: Boolean
        },
        photograph: {
            type: String
        },
        businessCard: {
            type: String
        },
        idProof: {
            type: String
        },
        invoiceId: {
            type: Number
        },
        paymentStatus: {
            type: String
        },
        paymentMethod: {
            type: String
        },
        transactionId: {
            type: String
        },
        isEmailTriggered: {
            type: Boolean
        },
        specialRegistration: {
            type: Boolean
        },
        attendance: {
            type: Boolean
        },
        battingRate: {
            type: Number
        },
        bowlingRate: {
            type: Number
        },
        fieldingRate: {
            type: Number
        },
        fitnessTime: {
            type: String
        },
        remark: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Player", schema)
