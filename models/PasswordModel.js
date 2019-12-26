export default {
    /**
     * This function adds one to its input.
     * @param {number} input any number
     * @returns {number} that number, plus one.
     */
    search(data, callback) {
        Password.find().exec(callback)
    },
    getOne(data, callback) {
        Password.findOne({
            _id: data.id
        }).exec(callback)
    },
    createPassword(data, callback) {
        const password = new Password(data)
        password.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        Password.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        Password.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
    }
}
