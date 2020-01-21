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
                            // url: "http://localhost:3000/Setting/emailReader/",
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
                                    // var attachments = new helper.Attachment()
                                    var mail = new helper.Mail(
                                        from_email,
                                        subject,
                                        to_email,
                                        content
                                    )
                                    // attachments
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
    },

    generatePdf: function(pdfObj, callback) {
        console.log("generatePdf", pdfObj)

        var pdf = require("html-pdf")
        var ejs = require("ejs")

        var file = pdfObj.filename

        var i = 0
        ejs.renderFile(file, pdfObj, {}, function(err, html) {
            if (err) {
                callback(err)
            } else {
                var path = "pdf/"
                var newFilename = pdfObj.newFilename
                var writestream = fs.createWriteStream(
                    path + newFilename + ".pdf"
                )

                writestream.on("finish", function(err, res) {
                    if (err) {
                        console.log("Something Fishy", err)
                    } else {
                        callback(null, {
                            name: newFilename,
                            url: path + newFilename
                        })
                    }
                })

                var options = {
                    paginationOffset: 5,
                    phantomPath:
                        "node_modules/phantomjs-prebuilt/bin/phantomjs",
                    // Export options
                    height: "10.5in", // allowed units: mm, cm, in, px
                    width: "10in",
                    format: "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    // "orientation": "portrait", // portrait or landscape
                    // "zoomFactor": "1", // default is 1
                    // Page options
                    border: {
                        top: "0.5cm", // default is 0, units: mm, cm, in, px
                        right: "0",
                        bottom: "0",
                        left: "0"
                    },
                    // File options
                    type: "pdf", // allowed file types: png, jpeg, pdf
                    timeout: 30000, // Timeout that will cancel phantomjs, in milliseconds
                    footer: {
                        height: "0"
                    }
                    // "filename": page.filename + ".pdf"
                }

                pdf.create(html, options).toStream(function(err, stream) {
                    if (err) {
                        callback(err)
                    } else {
                        i++
                        stream.pipe(writestream)
                    }
                })
            }
        })
    },

    readAttachment: function(filename, callback) {
        var Grid = require("gridfs-stream")
        var gfs = Grid(mongoose.connections[0].db, mongoose.mongo)
        var readstream = gfs.createReadStream({
            filename: filename
        })
        readstream.on("error", function(err) {
            callback(err, false)
        })
        var buf
        var bufs = []
        readstream.on("data", function(d) {
            bufs.push(d)
        })
        readstream.on("end", function() {
            buf = Buffer.concat(bufs)
            callback(null, buf)
        })
    },

    emailAttach: function(
        fromEmail,
        toEmail,
        subject,
        emailData,
        fileName,
        attachments,
        callback
    ) {
        Password.findOne({ name: "sendgrid" }, function(err, data) {
            console.log(err, data)
            if (err) {
                callback(err)
            } else {
                var ejs = require("ejs")
                var helper = require("sendgrid").mail
                var sg = require("sendgrid")(data.key)
                var mail = new helper.Mail()

                var email = new helper.Email(fromEmail.email, fromEmail.name)

                mail.setFrom(email)
                mail.setSubject(subject)
                var personalization = new helper.Personalization()
                _.each(toEmail, function(n) {
                    if (n.name) {
                        var email = new helper.Email(n.email, n.name)
                        personalization.addTo(email)
                    } else {
                        var email = new helper.Email(n.email)
                        personalization.addTo(email)
                    }
                })

                mail.addPersonalization(personalization)

                ejs.renderFile(fileName, emailData, {}, function(err, body) {
                    // console.log("err", err, "body", body)
                    if (err) {
                        callback(err)
                    } else {
                        var content = new helper.Content("text/html", body)
                        mail.addContent(content)
                        async.each(
                            attachments,
                            function(filename, callback) {
                                var attachment = new helper.Attachment()
                                SettingModel.readAttachment(filename, function(
                                    err,
                                    data
                                ) {
                                    // console.log(err, data)
                                    if (err) {
                                        callback(err)
                                    } else {
                                        var base64File = new Buffer(
                                            data
                                        ).toString("base64")
                                        attachment.setContent(base64File)
                                        attachment.setFilename(filename)
                                        attachment.setDisposition("attachment")
                                        mail.addAttachment(attachment)
                                        callback()
                                    }
                                })
                            },
                            function(err) {
                                if (err) {
                                    callback(err)
                                } else {
                                    var request = sg.emptyRequest({
                                        method: "POST",
                                        path: "/v3/mail/send",
                                        body: mail.toJSON()
                                    })
                                    sg.API(request, callback)
                                }
                            }
                        )
                    }
                })
            }
        })
    }
}
