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
                username: {
                    $regex: data.name,
                    $options: "i"
                }
            }
        }
        async.parallel(
            {
                result: function(callback) {
                    User.find(filter)
                        .skip(skipVal)
                        .limit(pageLimit)
                        .exec(callback)
                },
                count: function(callback) {
                    User.countDocuments(filter).exec(callback)
                }
            },
            callback
        )
    },
    getOne(data, callback) {
        User.findOne({
            _id: data.id
        }).exec(callback)
    },
    getOneByToken(data, callback) {
        User.findOne({
            "accessToken.token": {
                $in: data.token
            }
        }).exec(callback)
    },
    createUser(data, callback) {
        const user = new User(data)
        user.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        User.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        User.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
    },
    login: (data, callback) => {
        const uuid = require("uuidv4").default
        async.waterfall(
            [
                function(callback) {
                    User.findOne({
                        username: data.username,
                        password: data.password
                    }).exec(function(err, data2) {
                        if (err) {
                            callback(err)
                        } else if (!_.isEmpty(data2)) {
                            callback(null, data2)
                        } else {
                            callback(403)
                        }
                    })
                },
                function(user, callback) {
                    if (_.isEmpty(user)) {
                        callback(403)
                    } else {
                        user.accessToken.push({
                            token: uuid(),
                            expiry: moment().add(1, "M")
                        })
                        user.save(callback)
                    }
                }
            ],
            callback
        )
    },
    generateExcel: (data, res) => {
        User.find()
            .lean()
            .exec(function(err, userDetail) {
                if (err) res.callback(err)
                if (_.isEmpty(userDetail)) res.callback(null, [])
                var excelData = []
                async.each(
                    userDetail,
                    function(user, callback) {
                        var obj = {}
                        obj.USERNAME = user.username
                        obj.PASSWORD = user.password
                        if (user.email) {
                            obj.EMAIL = user.email
                        } else {
                            obj.EMAIL = ""
                        }
                        if (user.mobile) {
                            obj.MOBILE = user.mobile
                        } else {
                            obj.MOBILE = ""
                        }
                        excelData.push(obj)
                        callback()
                    },
                    function(err) {
                        if (err) res.callback(err)
                        SettingModel.generateExcel("User", excelData, res)
                    }
                )
            })
    }
}
