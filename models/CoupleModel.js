import SettingModel from "./SettingModel"

export default {
    /**
     * This function adds one to its input.
     * @param {number} input any number
     * @returns {number} that number, plus one.
     */
    search(data, callback) {
        var skipVal = 0
        var pageLimit = 10
        if (data.page) {
            skipVal = (data.page - 1) * pageLimit
        }
        var filter = {}
        if (data.name) {
            filter = {
                $or: [
                    {
                        firstName: {
                            $regex: data.name,
                            $options: "i"
                        }
                    },
                    {
                        "company.name": {
                            $regex: data.name,
                            $options: "i"
                        }
                    },
                    {
                        coupleId: {
                            $regex: data.name,
                            $options: "i"
                        }
                    }
                ]
            }
        }
        async.parallel(
            {
                result: function(callback) {
                    Couple.find(filter)
                        .skip(skipVal)
                        .limit(pageLimit)
                        .exec(callback)
                },
                count: function(callback) {
                    Couple.countDocuments(filter).exec(callback)
                }
            },
            callback
        )
    },
    getOne(data, callback) {
        Couple.findOne({
            _id: data.id
        }).exec(callback)
    },
    checkCoupleRegisteredOrNot(data, callback) {
        var matchObj

        if (data.dob && data.email) {
            matchObj = {
                dob: data.dob,
                email: data.email,
                fullName: data.fullName
            }
        } else if (data.fullName) {
            matchObj = {
                fullName: data.fullName
            }
        } else {
            matchObj = {
                firstName: data.firstName
            }
        }
        Couple.findOne(matchObj).exec(callback)
    },
    createCouple(data, callback) {
        if (data.middleName) {
            data.fullName =
                data.firstName + " " + data.middleName + " " + data.surname
        } else {
            data.fullName = data.firstName + " " + data.surname
        }
        async.waterfall(
            [
                function(callback) {
                    Couple.findOne({
                        fullName: data.fullName
                    }).exec(function(err, couple) {
                        if (err) callback(err)
                        if (_.isEmpty(couple)) {
                            callback(null, couple)
                        } else {
                            callback(null, "Couple Already Exist")
                        }
                    })
                },
                function(newCouple, callback) {
                    if (newCouple == "Couple Already Exist") {
                        callback(null, newCouple)
                    } else {
                        Couple.findOne()
                            .sort({ incrementalId: -1 })
                            .exec(function(err, couple) {
                                if (err) callback(err)
                                if (_.isEmpty(couple)) {
                                    data.incrementalId = 1
                                    data.coupleId = "JYF_" + 1
                                    data.invoiceId = 1
                                    callback(null, couple)
                                } else {
                                    data.incrementalId =
                                        couple.incrementalId + 1
                                    data.coupleId = "JYF_" + data.incrementalId
                                    data.invoiceId = couple.invoiceId + 1
                                    callback(null, couple)
                                }
                            })
                    }
                },
                function(coupleId, callback) {
                    if (coupleId == "Couple Already Exist") {
                        callback(null, coupleId)
                    } else {
                        const couple = new Couple(data)
                        couple.save(callback)
                    }
                }
            ],
            callback
        )
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        Couple.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        if (data2.middleName) {
            data2.fullName =
                data2.firstName + " " + data2.middleName + " " + data2.surname
        } else {
            data2.fullName = data2.firstName + " " + data2.surname
        }
        Couple.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
    },
    generateExcel: (data, res) => {
        Couple.find()
            .lean()
            .exec(function(err, coupleDetail) {
                if (err) res.callback(err)
                if (_.isEmpty(coupleDetail)) res.callback(null, [])
                var excelData = []
                var i = 0
                async.eachSeries(
                    coupleDetail,
                    function(couple, callback) {
                        var obj = {}
                        if (couple.coupleId) {
                            obj["Couple Id"] = couple.coupleId
                        } else {
                            obj["Couple Id"] = ""
                        }

                        if (couple.registrationDate) {
                            obj["Registration Date"] = moment(
                                couple.registrationDate
                            ).format("DD-MM-YYYY")
                            obj["Registration Time"] = moment(
                                couple.registrationDate
                            )
                                .add({ hours: 5, minutes: 30 })
                                .format("HH:mm A")
                        } else {
                            obj["Registration Date"] = ""
                            obj["Registration Time"] = ""
                        }

                        if (couple.firstName) {
                            obj["First Name"] = couple.firstName
                        } else {
                            obj["First Name"] = ""
                        }

                        if (couple.middleName) {
                            obj["Middle Name"] = couple.middleName
                        } else {
                            obj["Middle Name"] = ""
                        }

                        if (couple.surname) {
                            obj.Surname = couple.surname
                        } else {
                            obj.Surname = ""
                        }

                        if (couple.email) {
                            obj.Email = couple.email
                        } else {
                            obj.Email = ""
                        }

                        if (couple.mobile) {
                            obj.Mobile = couple.mobile
                        } else {
                            obj.Mobile = ""
                        }

                        if (couple.dob) {
                            obj.DOB = moment(couple.dob).format("DD-MM-YYYY")
                            // .add(1, "days")
                        } else {
                            obj.DOB = ""
                        }

                        if (couple.spouse.firstName) {
                            obj["Spouse First Name"] = couple.spouse.firstName
                        } else {
                            obj["Spouse First Name"] = ""
                        }

                        if (couple.spouse.middleName) {
                            obj["Spouse Middle Name"] = couple.spouse.middleName
                        } else {
                            obj["Spouse Middle Name"] = ""
                        }

                        if (couple.spouse.surname) {
                            obj["Spouse Surname"] = couple.spouse.surname
                        } else {
                            obj["Spouse Surname"] = ""
                        }

                        if (couple.spouse.email) {
                            obj["Spouse Email"] = couple.spouse.email
                        } else {
                            obj["Spouse Email"] = ""
                        }

                        if (couple.spouse.mobile) {
                            obj["Spouse Mobile"] = couple.spouse.mobile
                        } else {
                            obj["Spouse Mobile"] = ""
                        }

                        if (couple.spouse.dob) {
                            obj["Spouse DOB"] = moment(
                                couple.spouse.dob
                            ).format("DD-MM-YYYY")
                            // .add(1, "days")
                        } else {
                            obj["Spouse DOB"] = ""
                        }

                        if (couple.company.name) {
                            obj["Company Name"] = couple.company.name
                        } else {
                            obj["Company Name"] = ""
                        }

                        if (couple.company.address)
                            obj["Office Address"] = couple.company.address
                        else obj["Office Address"] = ""

                        if (couple.specialRegistration == true) {
                            obj["Private Link"] = "Yes"
                        } else {
                            obj["Private Link"] = "No"
                        }

                        if (couple.paymentMethod) {
                            obj["Payment Method"] = couple.paymentMethod
                        } else {
                            obj["Payment Method"] = ""
                        }

                        if (couple.paymentStatus) {
                            obj["Payment Status"] = couple.paymentStatus
                        } else {
                            obj["Payment Status"] = ""
                        }

                        if (couple.invoiceId) {
                            obj["Invoice No"] = couple.invoiceId
                        } else {
                            obj["Invoice No"] = ""
                        }

                        if (couple.transactionId) {
                            obj["Transaction Id"] = couple.transactionId
                        } else {
                            obj["Transaction Id"] = ""
                        }

                        if (couple.remark) {
                            obj["Remark"] = couple.remark
                        } else {
                            obj["Remark"] = ""
                        }

                        excelData.push(obj)
                        callback()
                    },
                    function(err) {
                        if (err) res.callback(err)
                        SettingModel.generateExcel("Team", excelData, res)
                    }
                )
            })
    },
    generateWelcomeMail: (data, callback) => {
        var emailData = {}
        emailData = data
        emailData.from = "jewelleryyouthforum@gmail.com"
        emailData.filename = "welcome-couple.ejs"
        emailData.subject = "JYPL Season 4 Registration Confirmation."
        // console.log("emaildata", emailData)

        SettingModel.email(emailData, function(err, emailRespo) {
            if (err) {
                callback(err)
            } else if (emailRespo) {
                callback(null, emailRespo)
            } else {
                callback(null, "Invalid data")
            }
        })
    },
    generateInvoiceMail: (data, callback) => {
        var emailData = {}
        emailData = data
        var fromEmail = {
            email: "jewelleryyouthforum@gmail.com",
            name: "Jewellery Youth Forum"
        }
        var fileName = "./views/invoice-mail.ejs"
        var subject = "JYPL Season 4 Registration Invoice."
        // console.log("emaildata", emailData)
        CoupleModel.generateInvoicePdf(data, function(err, pdfRespo) {
            if (err) {
                callback(err)
            } else if (pdfRespo) {
                // console.log(pdfRespo)
                var obj = {
                    fileName: pdfRespo.fileName,
                    filePath: pdfRespo.filePath
                }
                // var pdfPath = pdfRespo.filePath
                // console.log(
                //     "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
                //     pdfPath
                // )
                // var pdfPath =
                //     "/home/wohlig/Documents/personal/jypl/jypl-api/pdf/JYF_750-Raj_Shah.pdf"
                var toEmail = [{ email: data.email }]
                var attachments = []
                attachments.push(obj)
                SettingModel.emailAttach(
                    fromEmail,
                    toEmail,
                    subject,
                    emailData,
                    fileName,
                    attachments,
                    function(err, emailRespo) {
                        if (err) {
                            callback(err)
                        } else if (emailRespo) {
                            callback(null, emailRespo)
                        } else {
                            callback(null, "Invalid data")
                        }
                    }
                )
            } else {
                callback(null, "Invalid data")
            }
        })
    },
    generateInvoicePdf: (data, callback) => {
        console.log("name", data)
        var pdfObj = {}
        pdfObj.filename = "./views/invoice.ejs"
        pdfObj.email = data.email
        pdfObj.newFilename =
            data.coupleId + "-" + data.firstName + "_" + data.surname
        pdfObj.invoiceDate = new Date()
        pdfObj.companyName = data.company.name
        pdfObj.fullName = data.fullName
        pdfObj.coupleId = data.coupleId
        pdfObj.invoiceId = data.invoiceId
        pdfObj.mobile = data.mobile

        SettingModel.generatePdf(pdfObj, function(err, pdfRespo) {
            console.log("err", err, "pdfRespo", pdfRespo)
            if (err) {
                callback(err)
            } else if (pdfRespo) {
                // var pdfNamePath =
                //     "file:///home/wohlig/Documents/personal/jypl/jypl-api/pdf/" +
                //     pdfRespo.name +
                //     ".pdf"
                // var pdfNamePath =
                //     "http://api.jypl.in/pdf/" + pdfRespo.name + ".pdf"
                if (pdfRespo.name) {
                    var pdfNamePath =
                        "/home/projects/jypl-api/" + pdfRespo.url + ".pdf"
                } else {
                    var pdfNamePath = pdfRespo.filename
                }
                var obj = {
                    fileName: pdfObj.newFilename + ".pdf",
                    filePath: pdfNamePath
                }
                callback(null, obj)
            } else {
                callback(null, "Invalid data")
            }
        })
    }
}
