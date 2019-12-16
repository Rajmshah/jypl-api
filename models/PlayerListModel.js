import SettingModel from "./SettingModel"

export default {
    /**
     * This function adds one to its input.
     * @param {number} input any number
     * @returns {number} that number, plus one.
     */
    search(data, callback) {
        PlayerList.find({
            team: data.team
        }).exec(callback)
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
    generateExcel: (data, res) => {
        PlayerList.find()
            .populate("team")
            .lean()
            .exec(function(err, playerDetail) {
                if (err) res.callback(err)
                if (_.isEmpty(playerDetail)) res.callback(null, [])
                var excelData = []
                async.each(
                    playerDetail,
                    function(player, callback) {
                        // var obj = {}
                        // obj["TEAM NAME"] = player.team.name
                        // obj["VILLAGE"] = player.team.village
                        // obj["PLAYER NAME"] = player.fullName
                        // obj.AGE = player.age
                        // obj.ROLE = player.keyRole
                        // obj["BATTING TYPE"] = player.battingType
                        // obj["BOWLING TYPE"] = player.bowlingType
                        // if (player.isWicketkeeper) {
                        //     obj["WICKETKEEPER"] = "Yes"
                        // } else {
                        //     obj["WICKETKEEPER"] = "No"
                        // }
                        // obj.EMAIL = player.email
                        // obj.MOBILE = player.mobile
                        // if (player.photograph) {
                        //     obj.PHOTOGRAPH = "Yes"
                        // } else {
                        //     obj.PHOTOGRAPH = "No"
                        // }
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
                                                ).add(1, "days")

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
                                                ).add(1, "days")
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
