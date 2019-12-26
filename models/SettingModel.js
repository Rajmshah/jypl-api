export default {
    /**
     * This function adds one to its input.
     * @param {number} input any number
     * @returns {number} that number, plus one.
     */
    search(data, callback) {
        Setting.find().exec(callback)
    },
    getOne(data, callback) {
        Setting.findOne({
            _id: data.id
        }).exec(callback)
    },
    createSetting(data, callback) {
        const setting = new Setting(data)
        setting.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        Setting.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        Setting.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
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
    },

    email: function(data, callback) {
        Password.find().exec(function(err, userdata) {
            // console.log("userdata", userdata);
            if (err) {
                console.log(err)
                callback(err)
            } else if (userdata && userdata.length > 0) {
                if (data.filename && data.filename !== "") {
                    request.post(
                        {
                            url: "http://api.jypl.in/Setting/emailReader/",
                            json: data
                        },
                        function(err, http, body) {
                            console.log("body : ", body)
                            if (err) {
                                console.log(err)
                                callback(err)
                            } else {
                                if (body && body.value !== false) {
                                    var helper = require("sendgrid").mail
                                    var name = "No-reply"
                                    var from_email = new helper.Email(
                                        data.from,
                                        name
                                    )
                                    var to_email = new helper.Email(data.email)
                                    var subject = data.subject
                                    var content = new helper.Content(
                                        "text/html",
                                        body
                                    )
                                    var mail = new helper.Mail(
                                        from_email,
                                        subject,
                                        to_email,
                                        content
                                    )
                                    // console.log("api_key", userdata[0].name);
                                    var sg = require("sendgrid")(
                                        userdata[0].key
                                    )
                                    var request = sg.emptyRequest({
                                        method: "POST",
                                        path: "/v3/mail/send",
                                        body: mail.toJSON()
                                    })

                                    sg.API(request, function(error, response) {
                                        if (error) {
                                            callback(null, error)
                                            console.log(
                                                "Error response received"
                                            )
                                        } else {
                                            callback(null, response)
                                        }
                                    })
                                } else {
                                    callback(
                                        {
                                            message: "Error while sending mail."
                                        },
                                        null
                                    )
                                }
                            }
                        }
                    )
                } else {
                    callback(
                        {
                            message: "Please provide params"
                        },
                        null
                    )
                }
            } else {
                callback(
                    {
                        message: "No api keys found"
                    },
                    null
                )
            }
        })
    },

    emailTo: function(data, callback) {
        // console.log("hhhhhhhhhhhhhhhhhhhhh",data)
        Password.find().exec(function(err, userdata) {
            if (err) {
                callback(err, null)
            } else if (userdata && userdata.length > 0) {
                if (data.filename && data.filename !== "") {
                    //console.log("filename ", data.filename);
                    request.post(
                        {
                            url: "http://api.jypl.in/Setting/emailReader/",
                            json: data
                        },
                        function(err, http, body) {
                            // console.log("body : ", body);
                            if (err) {
                                console.log(err)
                                callback(err, null)
                            } else {
                                // console.log('email else');
                                if (body && body.value !== false) {
                                    var sg = require("sendgrid")(
                                        userdata[0].key
                                    )

                                    var request = sg.emptyRequest({
                                        method: "POST",
                                        path: "/v3/mail/send",
                                        body: {
                                            personalizations: [
                                                {
                                                    to: data.email1,
                                                    cc: data.cc1,
                                                    bcc: data.bcc1,
                                                    subject: data.subject
                                                }
                                            ],
                                            from: {
                                                email: data.from,
                                                name: "No-reply"
                                            },

                                            content: [
                                                {
                                                    type: "text/html",
                                                    value: body
                                                }
                                            ]
                                        }
                                    })

                                    sg.API(request, function(error, response) {
                                        if (error) {
                                            callback(null, error)
                                            console.log(
                                                "Error response received"
                                            )
                                        } else {
                                            // console.log(response.statusCode)
                                            // console.log(response.body)
                                            // console.log(response.headers)
                                            callback(null, response)
                                        }
                                    })
                                } else {
                                    callback(
                                        {
                                            message: "Error while sending mail."
                                        },
                                        null
                                    )
                                }
                            }
                        }
                    )
                } else {
                    callback(
                        {
                            message: "Please provide params"
                        },
                        null
                    )
                }
            } else {
                callback(
                    {
                        message: "No api keys found"
                    },
                    null
                )
            }
        })
    }
}
