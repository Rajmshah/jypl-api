var schema = new Schema(
    {
        incrementalId: {
            type: Number
        },
        coupleId: {
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
        dob: {
            type: Date
        },
        photograph: {
            type: String
        },
        idProof: {
            type: String
        },
        spouse: {
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
            dob: {
                type: Date
            },
            photograph: {
                type: String
            },
            idProof: {
                type: String
            }
        },
        company: {
            name: {
                type: String
            },
            address: {
                type: String
            }
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
        remark: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Couple", schema)
