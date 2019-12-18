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
                firstName: {
                    $regex: data.name,
                    $options: "i"
                }
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
    createPlayer(data, callback) {
        async.waterfall(
            [
                function(callback) {
                    Player.findOne()
                        .sort({ incrementalId: -1 })
                        .exec(function(err, player) {
                            if (err) callback(err)
                            if (_.isEmpty(player)) {
                                data.incrementalId = 750
                                data.playerId = "JYF" + 750
                                data.invoiceId = 1
                                callback(null, player)
                            } else {
                                data.incrementalId = player.incrementalId + 1
                                data.playerId = "JYF" + data.incrementalId
                                data.invoiceId = player.invoiceId + 1
                                callback(null, player)
                            }
                        })
                },
                function(playerId, callback) {
                    if (data.middleName) {
                        data.fullName =
                            data.firstName +
                            " " +
                            data.middleName +
                            " " +
                            data.surname
                    } else {
                        data.fullName = data.firstName + " " + data.surname
                    }

                    const player = new Player(data)
                    player.save(callback)
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
                async.each(
                    playerDetail,
                    function(player, callback) {
                        var obj = {
                            company: {}
                        }
                        if (player.registrationDate) {
                            obj["Registration Date"] = moment(
                                player.registrationDate,
                                "DD-MM-YYYY"
                            )
                            // .add(1, "days")
                        } else {
                            obj["Registration Date"] = ""
                        }

                        if (player.playerId) {
                            obj["Sr. No."] = player.playerId
                        } else {
                            obj["Sr. No."] = ""
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
                            obj.DOB = moment(player.dob, "DD-MM-YYYY")
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
                        excelData.push(obj)
                        callback()
                    },
                    function(err) {
                        if (err) res.callback(err)
                        SettingModel.generateExcel("Team", excelData, res)
                    }
                )
            })
    }
}
