export default {
    /**
     * This function adds one to its input.
     * @param {number} input any number
     * @returns {number} that number, plus one.
     */
    search(data, callback) {
        TeamList.find().exec(function(err, teamList) {
            if (err) callback(err)
            if (_.isEmpty(teamList)) {
                callback(null, [])
            } else {
                var array = []
                _.each(teamList, function(team) {
                    array.push({ name: team.name })
                })
                callback(null, array)
            }
        })
    },
    searchTeamList(data, callback) {
        TeamList.find().exec(callback)
    },
    getOne(data, callback) {
        TeamList.findOne({
            _id: data.id
        }).exec(callback)
    },
    createTeamList(data, callback) {
        const teamList = new TeamList(data)
        teamList.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        TeamList.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        TeamList.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
    },
    generateExcel: function(name, found, res) {
        var excelData = []
        _.each(found, function(singleData) {
            var singleExcel = {}
            _.each(singleData, function(n, key) {
                if (key != "__v" && key != "createdAt" && key != "updatedAt") {
                    singleExcel[key] = n
                }
            })
            excelData.push(singleExcel)
        })
        var xls = json2xls(excelData)

        var folder = "./.tmp/"
        fse.ensureDir(folder, (err) => {
            var path =
                name + "-" + moment().format("MMM-DD-YYYY-hh-mm-ss-a") + ".xlsx"
            var finalPath = folder + path

            fs.writeFile(finalPath, xls, "binary", function(err) {
                if (err) {
                    res.callback(err, null)
                } else {
                    fs.readFile(finalPath, function(err, excel) {
                        if (err) {
                            res.callback(err, null)
                        } else {
                            res.send(excel)
                            fs.unlink(finalPath)
                        }
                    })
                }
            })
        })
    }
}
