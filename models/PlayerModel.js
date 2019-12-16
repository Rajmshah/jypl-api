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
                                callback(null, player)
                            } else {
                                data.incrementalId = player.incrementalId + 1
                                data.playerId = "JYF" + data.incrementalId
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
            .populate("team")
            .lean()
            .exec(function(err, playerDetail) {
                if (err) res.callback(err)
                if (_.isEmpty(playerDetail)) res.callback(null, [])
                var excelData = []
                async.each(
                    playerDetail,
                    function(player, callback) {
                        var obj = {}
                        obj["TEAM NAME"] = player.team.name
                        obj["VILLAGE"] = player.team.village
                        obj["PLAYER NAME"] = player.fullName
                        obj.AGE = player.age
                        obj.ROLE = player.keyRole
                        obj["BATTING TYPE"] = player.battingType
                        obj["BOWLING TYPE"] = player.bowlingType
                        if (player.isWicketkeeper) {
                            obj["WICKETKEEPER"] = "Yes"
                        } else {
                            obj["WICKETKEEPER"] = "No"
                        }
                        obj.EMAIL = player.email
                        obj.MOBILE = player.mobile
                        if (player.photograph) {
                            obj.PHOTOGRAPH = "Yes"
                        } else {
                            obj.PHOTOGRAPH = "No"
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
