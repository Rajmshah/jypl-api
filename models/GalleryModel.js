export default {
    /**
     * This function adds one to its input.
     * @param {number} input any number
     * @returns {number} that number, plus one.
     */
    search(data, callback) {
        Gallery.find().exec(callback)
    },
    getOne(data, callback) {
        Gallery.findOne({
            _id: data.id
        }).exec(callback)
    },
    createGallery(data, callback) {
        const gallery = new Gallery(data)
        gallery.save(callback)
    },
    delete(data, callback) {
        var obj = {
            _id: data.id
        }
        Gallery.deleteOne(obj, callback)
    },
    updateData: (param, data, callback) => {
        var data2 = _.cloneDeep(data)
        if (data2._id) {
            delete data2._id
        }
        Gallery.updateOne({ _id: param.id }, { $set: data2 }).exec(callback)
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

    // getAlbumsByType: function(data, callback) {
    //     var pipeline = [
    //       {
    //         $match: {
    //           mediaType: data.mediaType,
    //           status: "Enable"
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: "$folderName",
    //           folderName: {
    //             $first: "$folderName"
    //           },
    //           title: {
    //             $first: "$title"
    //           },
    //           mediaLink: {
    //             $first: "$mediaLink"
    //           },
    //           mediaType: {
    //             $first: "$mediaType"
    //           },
    //           eventDate: {
    //             $first: "$eventDate"
    //           },
    //           videoThumbnail: {
    //             $first: "$videoThumbnail"
    //           },
    //           order: {
    //             $first: "$order"
    //           },
    //           status: {
    //             $first: "$status"
    //           }
    //         }
    //       },
    //       {
    //         $sort: {
    //           order: 1
    //         }
    //       }
    //     ];
    //     var newPipeLine;
    //     if (data.limit) {
    //       newPipeLine = _.cloneDeep(pipeline);
    //       newPipeLine.push({
    //         $limit: data.limit
    //       });
    //     } else {
    //       newPipeLine = _.cloneDeep(pipeline);
    //     }
    //     Gallery.aggregate(newPipeLine).exec(callback);
    //   },

    //   uploadExcel: function(importData, callback) {
    //     var errorFound = false;
    //     async.concatSeries(
    //       importData,
    //       function(singleData, callback) {
    //         var obj = {};
    //         obj = {
    //           folderName: singleData["Folder Name"],
    //           title: singleData.Title,
    //           mediaType: singleData.Type,
    //           mediaLink: singleData.Link,
    //           eventDate: moment(singleData["Event Date"], "DD-MM-YYYY"),
    //           videoThumbnail: singleData.Thumbnail,
    //           order: singleData.Order,
    //           status: singleData.Status
    //         };
    //         Gallery.saveData(obj, function(err, data) {
    //           if (err) {
    //             errorFound = true;
    //             callback(null, {
    //               error: true,
    //               data: err
    //             });
    //           } else {
    //             callback(null, {
    //               error: false,
    //               data: data
    //             });
    //           }
    //         });
    //       },
    //       function(err, result) {
    //         if (err) {
    //           callback(err, null);
    //         } else {
    //           callback(null, result);
    //           if (errorFound) {
    //             async.each(
    //               result,
    //               function(singleData, callback) {
    //                 if (!singleData.error && singleData.data._id) {
    //                   Gallery.deleteData(
    //                     {
    //                       _id: singleData.data._id
    //                     },
    //                     function(err, deleted) {
    //                       callback(null);
    //                     }
    //                   );
    //                 } else {
    //                   callback(null);
    //                 }
    //               },
    //               function(err) {
    //                 if (err) {
    //                 } else {
    //                   // console.log("Successfully Deleted");
    //                 }
    //               }
    //             );
    //           }
    //         }
    //       }
    //     );
    //   },

    //   generateSampleExcel: function(data, res) {
    //     var arrJsonExcel = [];
    //     var obj = {};
    //     name = "SampleGallery";
    //     arrJsonExcel = [
    //       {
    //         "Folder Name": "RIFC Event 1",
    //         Title: "Inauguration",
    //         Type: "Photo",
    //         Link:
    //           "https://storage.googleapis.com/rifc/02fc902d-2974-49e3-98f2-9c88e6df8b3a.jpg",
    //         "Event Date": moment().format("DD/MM/YY"),
    //         Thumbnail: "",
    //         Order: 1,
    //         Status: "Enable"
    //       },
    //       {
    //         "Folder Name": "RIFC Event 1",
    //         Title: "Inauguration",
    //         Type: "Video",
    //         Link: "Oxp0hNB02QQ",
    //         "Event Date": moment().format("DD/MM/YY"),
    //         Thumbnail:
    //           "https://storage.googleapis.com/rifc/02fc902d-2974-49e3-98f2-9c88e6df8b3a.jpg",
    //         Order: 1,
    //         Status: "Enable"
    //       }
    //     ];

    //     // arrJsonExcel.push(obj);
    //     Config.generateExcel(name, arrJsonExcel, res);
    //   },

    //   generateExcel: function(data, res) {
    //     var name = "Gallery";
    //     Gallery.find()
    //       .lean()
    //       .exec(function(err, media) {
    //         if (err) {
    //           callback(err);
    //         } else {
    //           if (media) {
    //           } else {
    //             Config.generateExcel(name, [], res);
    //           }
    //         }
    //         async.concatSeries(
    //           media,
    //           function(singleData, callback) {
    //             var obj = {};
    //             obj = {
    //               "Folder Name": singleData.folderName,
    //               Title: singleData.title,
    //               Type: singleData.mediaType,
    //               Link: singleData.mediaLink,
    //               "Event Date": moment(singleData.eventDate).format("DD-MM-YYYY"),
    //               Thumbnail: singleData.videoThumbnail,
    //               Order: singleData.order,
    //               Status: singleData.status
    //             };
    //             callback(null, obj);
    //           },
    //           function(err, allMedias) {
    //             Config.generateExcel(name, allMedias, res);
    //           }
    //         );
    //       });
    //   }
}
