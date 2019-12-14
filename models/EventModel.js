export default {
    /**
     * This function adds one to its input.
     * @param {number} input any number
     * @returns {number} that number, plus one.
     */
    search(data, callback) {
        Event.find().exec(callback)
    },
    getOne(data, callback) {
        Event.findOne({
            _id: data.id
        }).exec(callback)
    },
    createEvent(data, callback) {
        const event = new Event(data)
        event.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        Event.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        Event.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
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
    // searchUpcomingEvent: function(data, callback) {
    //     var defaultLimit = 2
    //     var filter = {
    //         limit: data.limit ? parseInt(data.limit) : defaultLimit
    //     }
    //     filter.paginatedField = "eventDate"
    //     filter.sortAscending = true
    //     if (data.next) {
    //         filter.next = data.next
    //     }
    //     if (data.previous) {
    //         filter.previous = data.previous
    //     }
    //     filter.query = {
    //         eventDate: { $gt: new Date() },
    //         status: "Enable"
    //     }
    //     Event.paginate(filter).then((result) => {
    //         callback(null, result)
    //     })
    // }
    //   searchPastEvent: function(data, callback) {
    //     var defaultLimit = 1;
    //     var filter = {
    //       limit: data.limit ? parseInt(data.limit) : defaultLimit
    //     };
    //     filter.paginatedField = "eventDate";
    //     if (data.next) {
    //       filter.next = data.next;
    //     }
    //     if (data.previous) {
    //       filter.previous = data.previous;
    //     }
    //     filter.query = {
    //       eventDate: { $lt: new Date() },
    //       status: "Enable"
    //     };
    //     Event.paginate(filter).then(result => {
    //       callback(null, result);
    //     });
    //   }
}
