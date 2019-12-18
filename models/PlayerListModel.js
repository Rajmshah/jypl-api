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
                        fullName: {
                            $regex: data.name,
                            $options: "i"
                        }
                    },
                    {
                        team: {
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
                    PlayerList.find(filter)
                        .skip(skipVal)
                        .limit(pageLimit)
                        .exec(callback)
                },
                count: function(callback) {
                    PlayerList.countDocuments(filter).exec(callback)
                }
            },
            callback
        )
    },
    getOne(data, callback) {
        PlayerList.findOne({
            _id: data.id
        }).exec(callback)
    },
    createPlayerList(data, callback) {
        if (data.middleName) {
            data.fullName =
                data.firstName + " " + data.middleName + " " + data.surname
        } else {
            data.fullName = data.firstName + " " + data.surname
        }
        const playerList = new PlayerList(data)
        playerList.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        PlayerList.deleteOne(obj, callback)
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
        PlayerList.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
    },
    // generateExcel: (data, res) => {
    //     PlayerList.find()
    //         .populate("team")
    //         .lean()
    //         .exec(function(err, playerDetail) {
    //             if (err) res.callback(err)
    //             if (_.isEmpty(playerDetail)) res.callback(null, [])
    //             var excelData = []
    //             async.each(
    //                 playerDetail,
    //                 function(player, callback) {
    //                      var obj = {
    //     company: {}
    // }
    // if (player.registrationDate) {
    //     obj["Registration Date"] = moment(
    //         player.registrationDate,
    //         "DD-MM-YYYY"
    //     )
    //     // .add(1, "days")
    // } else {
    //     obj["Registration Date"] = ""
    // }

    // if (player.playerId) {
    //     obj["Sr. No."] = player.playerId
    // } else {
    //     obj["Sr. No."] = ""
    // }

    // if (player.firstName) {
    //     obj["First Name"] = player.firstName
    // } else {
    //     obj["First Name"] = ""
    // }

    // if (player.middleName) {
    //     obj["Middle Name"] = player.middleName
    // } else {
    //     obj["Middle Name"] = ""
    // }

    // if (player.surname) {
    //     obj.Surname = player.surname
    // } else {
    //     obj.Surname = ""
    // }

    // if (player.email) {
    //     obj.Email = player.email
    // } else {
    //     obj.Email = ""
    // }

    // if (player.mobile) {
    //     obj.Mobile = player.mobile
    // } else {
    //     obj.Mobile = ""
    // }

    // if (player.address) {
    //     obj.Address = player.address
    // } else {
    //     obj.Address = ""
    // }

    // if (player.dob) {
    //     obj.DOB = moment(player.dob, "DD-MM-YYYY")
    //     // .add(1, "days")
    // } else {
    //     obj.DOB = ""
    // }

    // if (player.company.name) {
    //     obj["Company Name"] = player.company.name
    // } else {
    //     obj["Company Name"] = ""
    // }

    // if (player.company.businessType) {
    //     obj["Business Type"] = player.company.businessType
    // } else {
    //     obj["Business Type"] = ""
    // }

    // if (player.company.designation) {
    //     obj.Designation = player.company.designation
    // } else {
    //     obj.Designation = ""
    // }

    // if (player.company.relationship) {
    //     obj.Relationship = player.company.relationship
    // } else {
    //     obj.Relationship = ""
    // }

    // if (player.company.address)
    //     obj["Office Address"] = player.company.address
    // else obj["Office Address"] = ""

    // if (player.keyRole) obj.Role = player.keyRole
    // else obj.Role = ""

    // if (player.battingType) obj.Batting = player.battingType
    // else obj.Batting = ""

    // if (player.bowlingType) obj.Bowling = player.bowlingType
    // else obj.Bowling = ""

    // if (player.isWicketkeeper == true) {
    //     obj["Wicket Keeper"] = "Yes"
    // } else {
    //     obj["Wicket Keeper"] = "No"
    // }

    // if (player.team) obj.Team = player.team
    // else obj.Team = ""

    // if (player.hasPlayed == true) {
    //     obj.Played = "Yes"
    // } else {
    //     obj.Played = "No"
    // }

    // if (player.jerseyName)
    //     obj["Jersey Name"] = player.jerseyName
    // else obj["Jersey Name"] = ""

    // if (player.shirtSize)
    //     obj["Jersey Size"] = player.shirtSize
    // else obj["Jersey Size"] = ""

    // if (player.trouserSize)
    //     obj["Waist Size"] = player.trouserSize
    // else obj["Waist Size"] = ""

    // if (player.trackLength)
    //     obj["Track Length"] = player.trackLength
    // else obj["Track Length"] = ""

    // if (player.beOwner == true) {
    //     obj.Owner = "Yes"
    // } else {
    //     obj.Owner = "No"
    // }

    // if (player.beSponsor == true) {
    //     obj.Sponsor = "Yes"
    // } else {
    //     obj.Sponsor = "No"
    // }

    // if (player.paymentMethod) {
    //     obj["Payment Method"] = player.paymentMethod
    // } else {
    //     obj["Payment Method"] = ""
    // }

    // if (player.paymentStatus) {
    //     obj["Payment Status"] = player.paymentStatus
    // } else {
    //     obj["Payment Status"] = ""
    // }

    // if (player.invoiceId) {
    //     obj["Invoice No"] = player.invoiceId
    // } else {
    //     obj["Invoice No"] = ""
    // }

    // if (player.transactionId) {
    //     obj["Transaction Id"] = player.transactionId
    // } else {
    //     obj["Transaction Id"] = ""
    // }
    //                     excelData.push(obj)
    //                     callback()
    //                 },
    //                 function(err) {
    //                     if (err) res.callback(err)
    //                     SettingModel.generateExcel("Team", excelData, res)
    //                 }
    //             )
    //         })
    // },
    uploadExcel: function(data, callback) {
        async.waterfall(
            [
                function(callback) {
                    var options = {
                        url: `${env.uploadURL}/api/Upload/importGS`,
                        method: "GET",
                        qs: data
                    }
                    request(options, function(err, response, body) {
                        if (err) callback(err)
                        if (body == "Not found" || _.isEmpty(body)) {
                            callback(null, [])
                        } else {
                            callback(null, JSON.parse(body))
                        }
                    })
                },
                function(importData, callback) {
                    var errorFound = false
                    async.waterfall(
                        [
                            function(callback) {
                                if (_.isEmpty(importData)) {
                                    callback(null, [])
                                } else {
                                    async.concatSeries(
                                        importData,
                                        function(singleData, callback) {
                                            var obj = {
                                                company: {}
                                            }
                                            if (singleData["Registration Date"])
                                                obj.registrationDate = moment(
                                                    singleData[
                                                        "Registration Date"
                                                    ],
                                                    "DD-MM-YYYY"
                                                )
                                            // .add(1, "days")

                                            if (singleData["Sr. No."])
                                                obj.playerId =
                                                    singleData["Sr. No."]

                                            if (singleData["First Name"])
                                                obj.firstName =
                                                    singleData["First Name"]

                                            if (singleData["Middle Name"])
                                                obj.middleName =
                                                    singleData["Middle Name"]

                                            if (singleData["Surname"])
                                                obj.surname = singleData.Surname

                                            if (
                                                singleData["Middle Name"] &&
                                                singleData["Surname"] &&
                                                singleData["First Name"]
                                            ) {
                                                obj.fullName =
                                                    singleData["First Name"] +
                                                    " " +
                                                    singleData["Middle Name"] +
                                                    " " +
                                                    singleData["Surname"]
                                            } else if (
                                                singleData["Surname"] &&
                                                singleData["First Name"]
                                            ) {
                                                obj.fullName =
                                                    singleData["First Name"] +
                                                    " " +
                                                    singleData["Surname"]
                                            }

                                            if (singleData.Email)
                                                obj.email = singleData.Email

                                            if (singleData.Mobile)
                                                obj.mobile = singleData.Mobile

                                            if (singleData.Address)
                                                obj.address = singleData.Address

                                            if (singleData.DOB) {
                                                obj.dob = moment(
                                                    singleData.DOB,
                                                    "DD-MM-YYYY"
                                                )
                                                // .add(1, "days")
                                            }

                                            if (singleData["Company Name"])
                                                obj.company.name =
                                                    singleData["Company Name"]

                                            if (singleData["Business Type"])
                                                obj.company.businessType =
                                                    singleData["Business Type"]

                                            if (singleData.Designation)
                                                obj.company.designation =
                                                    singleData.Designation

                                            if (singleData.Relationship)
                                                obj.company.relationship =
                                                    singleData.Relationship

                                            if (singleData["Office Address"])
                                                obj.company.address =
                                                    singleData["Office Address"]

                                            if (singleData.Role)
                                                obj.keyRole = singleData.Role

                                            if (singleData.Batting)
                                                obj.battingType =
                                                    singleData.Batting

                                            if (singleData.Bowling)
                                                obj.bowlingType =
                                                    singleData.Bowling

                                            if (
                                                singleData["Wicket Keeper"] ==
                                                    "yes" ||
                                                singleData["Wicket Keeper"] ==
                                                    "Yes" ||
                                                singleData["Wicket Keeper"] ==
                                                    "YES"
                                            ) {
                                                obj.isWicketkeeper = true
                                            } else {
                                                obj.isWicketkeeper = false
                                            }

                                            if (singleData.Team)
                                                obj.team = singleData.Team

                                            if (
                                                singleData.Played == "yes" ||
                                                singleData.Played == "Yes" ||
                                                singleData.Played == "YES"
                                            ) {
                                                obj.hasPlayed = true
                                            } else {
                                                obj.hasPlayed = false
                                            }

                                            if (singleData["Jersey Name"])
                                                obj.jerseyName =
                                                    singleData["Jersey Name"]

                                            if (singleData["Jersey Size"])
                                                obj.shirtSize =
                                                    singleData["Jersey Size"]

                                            if (singleData["Waist Size"])
                                                obj.trouserSize =
                                                    singleData["Waist Size"]

                                            if (singleData["Track Length"])
                                                obj.trackLength =
                                                    singleData["Track Length"]

                                            if (
                                                singleData.Owner == "yes" ||
                                                singleData.Owner == "Yes" ||
                                                singleData.Owner == "YES"
                                            ) {
                                                obj.beOwner = true
                                            } else {
                                                obj.beOwner = false
                                            }

                                            if (
                                                singleData.Sponsor == "yes" ||
                                                singleData.Sponsor == "Yes" ||
                                                singleData.Sponsor == "YES"
                                            ) {
                                                obj.beSponsor = true
                                            } else {
                                                obj.beSponsor = false
                                            }

                                            if (singleData["Payment Method"]) {
                                                obj.paymentMethod =
                                                    singleData["Payment Method"]
                                            }

                                            if (singleData["Payment Status"]) {
                                                obj.paymentStatus =
                                                    singleData["Payment Status"]
                                            }

                                            if (singleData["Invoice No"]) {
                                                obj.invoiceId =
                                                    singleData["Invoice No"]
                                            }

                                            const playerList = new PlayerList(
                                                obj
                                            )
                                            playerList.save(function(
                                                err,
                                                data
                                            ) {
                                                if (err) {
                                                    errorFound = true
                                                    callback(null, {
                                                        error: true,
                                                        data: err
                                                    })
                                                } else {
                                                    callback(null, {
                                                        error: false,
                                                        data: data
                                                    })
                                                }
                                            })
                                        },
                                        function(err, result) {
                                            if (err) {
                                                callback(err)
                                            } else {
                                                if (errorFound) {
                                                    async.each(
                                                        result,
                                                        function(
                                                            singleData,
                                                            callback
                                                        ) {
                                                            if (
                                                                !singleData.error &&
                                                                singleData.data
                                                                    ._id
                                                            ) {
                                                                PlayerList.delete(
                                                                    {
                                                                        _id:
                                                                            singleData
                                                                                .data
                                                                                ._id
                                                                    },
                                                                    function(
                                                                        err,
                                                                        deleted
                                                                    ) {
                                                                        callback()
                                                                    }
                                                                )
                                                            } else {
                                                                callback()
                                                            }
                                                        },
                                                        function(err) {
                                                            if (err) {
                                                                callback(err)
                                                            } else {
                                                                console.log(
                                                                    "Successfully Deleted"
                                                                )
                                                                callback()
                                                            }
                                                        }
                                                    )
                                                } else {
                                                    callback(null, result)
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        ],
                        callback
                    )
                }
            ],
            callback
        )
    }
}
