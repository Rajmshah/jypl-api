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
                name: {
                    $regex: data.name,
                    $options: "i"
                }
            }
        }
        async.parallel(
            {
                result: function(callback) {
                    Team.find(filter)
                        .skip(skipVal)
                        .limit(pageLimit)
                        .exec(callback)
                },
                count: function(callback) {
                    Team.countDocuments(filter).exec(callback)
                }
            },
            callback
        )
    },
    getAll(data, callback) {
        Team.find().exec(callback)
    },
    getOne(data, callback) {
        Team.findOne({
            _id: data.id
        }).exec(callback)
    },
    getOneByUser(data, callback) {
        Team.findOne({
            user: data.user
        }).exec(callback)
    },
    createTeam(data, callback) {
        const team = new Team(data)
        team.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        Team.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        Team.updateOne(
            { _id: param.id },
            { $set: data2 },
            { upsert: true }
        ).exec(callback)
    }
}
