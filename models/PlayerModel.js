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
                        playerId: {
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
                    Player.find(filter)
                        .skip(skipVal)
                        .limit(pageLimit)
                        .exec(callback)
                },
                count: function(callback) {
                    Player.countDocuments(filter).exec(callback)
                }
            },
            callback
        )
    },
    getOne(data, callback) {
        Player.findOne({
            _id: data.id
        }).exec(callback)
    },
    checkPlayerRegisteredOrNot(data, callback) {
        var matchObj

        if (data.dob && data.email) {
            matchObj = {
                dob: data.dob,
                email: data.email,
                fullName: data.fullName,
                team: data.team
            }
        } else if (data.fullName) {
            matchObj = {
                fullName: data.fullName,
                team: data.team
            }
        } else {
            matchObj = {
                firstName: data.firstName,
                team: data.team
            }
        }
        Player.findOne(matchObj).exec(callback)
    },
    createPlayer(data, callback) {
        if (data.middleName) {
            data.fullName =
                data.firstName + " " + data.middleName + " " + data.surname
        } else {
            data.fullName = data.firstName + " " + data.surname
        }
        async.waterfall(
            [
                function(callback) {
                    Player.findOne({
                        fullName: data.fullName,
                        team: data.team
                    }).exec(function(err, player) {
                        if (err) callback(err)
                        if (_.isEmpty(player)) {
                            callback(null, player)
                        } else {
                            callback(null, "Player Already Exist")
                        }
                    })
                },
                function(newplayer, callback) {
                    if (newplayer == "Player Already Exist") {
                        callback(null, newplayer)
                    } else {
                        Player.findOne()
                            .sort({ incrementalId: -1 })
                            .exec(function(err, player) {
                                if (err) callback(err)
                                if (_.isEmpty(player)) {
                                    data.incrementalId = 750
                                    data.playerId = "JYF_" + 750
                                    data.invoiceId = 1
                                    callback(null, player)
                                } else {
                                    data.incrementalId =
                                        player.incrementalId + 1
                                    data.playerId = "JYF_" + data.incrementalId
                                    data.invoiceId = player.invoiceId + 1
                                    callback(null, player)
                                }
                            })
                    }
                },
                function(playerId, callback) {
                    if (playerId == "Player Already Exist") {
                        callback(null, playerId)
                    } else {
                        const player = new Player(data)
                        player.save(callback)
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
        Player.deleteOne(obj, callback)
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
        Player.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
    },
    generateExcel: (data, res) => {
        Player.find()
            .lean()
            .exec(function(err, playerDetail) {
                if (err) res.callback(err)
                if (_.isEmpty(playerDetail)) res.callback(null, [])
                var excelData = []
                var i = 0
                async.eachSeries(
                    playerDetail,
                    function(player, callback) {
                        var obj = {}
                        if (player.playerId) {
                            obj["Player Id"] = player.playerId
                        } else {
                            obj["Player Id"] = ""
                        }

                        if (player.registrationDate) {
                            obj["Registration Date"] = moment(
                                player.registrationDate
                            ).format("DD-MM-YYYY")
                            obj["Registration Time"] = moment(
                                player.registrationDate
                            ).format("HH:mm A")
                        } else {
                            obj["Registration Date"] = ""
                            obj["Registration Time"] = ""
                        }

                        if (player.firstName) {
                            obj["First Name"] = player.firstName
                        } else {
                            obj["First Name"] = ""
                        }

                        if (player.middleName) {
                            obj["Middle Name"] = player.middleName
                        } else {
                            obj["Middle Name"] = ""
                        }

                        if (player.surname) {
                            obj.Surname = player.surname
                        } else {
                            obj.Surname = ""
                        }

                        if (player.email) {
                            obj.Email = player.email
                        } else {
                            obj.Email = ""
                        }

                        if (player.mobile) {
                            obj.Mobile = player.mobile
                        } else {
                            obj.Mobile = ""
                        }

                        if (player.address) {
                            obj.Address = player.address
                        } else {
                            obj.Address = ""
                        }

                        if (player.dob) {
                            obj.DOB = moment(player.dob).format("DD-MM-YYYY")
                            // .add(1, "days")
                        } else {
                            obj.DOB = ""
                        }

                        if (player.company.name) {
                            obj["Company Name"] = player.company.name
                        } else {
                            obj["Company Name"] = ""
                        }

                        if (player.company.businessType) {
                            obj["Business Type"] = player.company.businessType
                        } else {
                            obj["Business Type"] = ""
                        }

                        if (player.company.designation) {
                            obj.Designation = player.company.designation
                        } else {
                            obj.Designation = ""
                        }

                        if (player.company.relationship) {
                            obj.Relationship = player.company.relationship
                        } else {
                            obj.Relationship = ""
                        }

                        if (player.company.address)
                            obj["Office Address"] = player.company.address
                        else obj["Office Address"] = ""

                        if (player.keyRole) obj.Role = player.keyRole
                        else obj.Role = ""

                        if (player.battingType) obj.Batting = player.battingType
                        else obj.Batting = ""

                        if (player.bowlingType) obj.Bowling = player.bowlingType
                        else obj.Bowling = ""

                        if (player.isWicketkeeper == true) {
                            obj["Wicket Keeper"] = "Yes"
                        } else {
                            obj["Wicket Keeper"] = "No"
                        }

                        if (player.team) obj.Team = player.team
                        else obj.Team = ""

                        if (player.hasPlayed == true) {
                            obj.Played = "Yes"
                        } else {
                            obj.Played = "No"
                        }

                        if (player.jerseyName)
                            obj["Jersey Name"] = player.jerseyName
                        else obj["Jersey Name"] = ""

                        if (player.shirtSize)
                            obj["Jersey Size"] = player.shirtSize
                        else obj["Jersey Size"] = ""

                        if (player.trouserSize)
                            obj["Waist Size"] = player.trouserSize
                        else obj["Waist Size"] = ""

                        if (player.trackLength)
                            obj["Track Length"] = player.trackLength
                        else obj["Track Length"] = ""

                        if (player.beOwner == true) {
                            obj.Owner = "Yes"
                        } else {
                            obj.Owner = "No"
                        }

                        if (player.beSponsor == true) {
                            obj.Sponsor = "Yes"
                        } else {
                            obj.Sponsor = "No"
                        }

                        if (player.specialRegistration == true) {
                            obj["Private Link"] = "Yes"
                        } else {
                            obj["Private Link"] = "No"
                        }

                        if (player.paymentMethod) {
                            obj["Payment Method"] = player.paymentMethod
                        } else {
                            obj["Payment Method"] = ""
                        }

                        if (player.paymentStatus) {
                            obj["Payment Status"] = player.paymentStatus
                        } else {
                            obj["Payment Status"] = ""
                        }

                        if (player.invoiceId) {
                            obj["Invoice No"] = player.invoiceId
                        } else {
                            obj["Invoice No"] = ""
                        }

                        if (player.transactionId) {
                            obj["Transaction Id"] = player.transactionId
                        } else {
                            obj["Transaction Id"] = ""
                        }

                        if (player.attendance) {
                            obj["Attendance"] = player.attendance
                        } else {
                            obj["Attendance"] = ""
                        }

                        if (player.battingRate) {
                            obj["Batting Rate"] = player.battingRate
                        } else {
                            obj["Batting Rate"] = ""
                        }

                        if (player.bowlingRate) {
                            obj["Bowling Rate"] = player.bowlingRate
                        } else {
                            obj["Bowling Rate"] = ""
                        }

                        if (player.fieldingRate) {
                            obj["Fielding Rate"] = player.fieldingRate
                        } else {
                            obj["Fielding Rate"] = ""
                        }

                        if (player.fitnessTime) {
                            obj["Fitness Time"] = player.fitnessTime
                        } else {
                            obj["Fitness Time"] = ""
                        }

                        if (player.remark) {
                            obj["Remark"] = player.remark
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
        emailData.filename = "welcome.ejs"
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
        PlayerModel.generateInvoicePdf(data, function(err, pdfRespo) {
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
            data.playerId + "-" + data.firstName + "_" + data.surname
        pdfObj.invoiceDate = new Date()
        pdfObj.companyName = data.company.name
        pdfObj.fullName = data.fullName
        pdfObj.playerId = data.playerId
        pdfObj.invoiceId = data.invoiceId
        pdfObj.address = data.address
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
