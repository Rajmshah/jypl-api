const router = Router()
router.get("/", (req, res) => {
    GalleryModel.search(req.query, res.callback)
})
router.get(
    "/getOne/:id",
    ValidateRequest({
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    format: "objectId"
                }
            }
        }
    }),
    (req, res) => {
        GalleryModel.getOne(req.params, res.callback)
    }
)
router.post("/saveGallery", (req, res) => {
    GalleryModel.createGallery(req.body, res.callback)
})
router.put("/updateGallery/:id", (req, res) => {
    GalleryModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteGallery/:id", (req, res) => {
    GalleryModel.delete(req.params, res.callback)
})

// getAlbumsByType: function(req, res) {
//     Gallery.getAlbumsByType(req.body, res.callback);
//   },

//   getAllByAlbumType: function(req, res) {
//     Gallery.find({
//       mediaType: req.body.mediaType,
//       folderName: req.body.folderName
//     }).exec(res.callback);
//   },

//   uploadExcel: function(req, res) {
//     if (req.body.file) {
//       Config.importGS(req.body.file, function(err, importData) {
//         if (err || _.isEmpty(importData)) {
//           res.json({
//             data: err,
//             value: false
//           });
//         } else {
//           Gallery.uploadExcel(importData, res.callback);
//         }
//       });
//     } else {
//       res.json({
//         data: "File Not Found",
//         value: false
//       });
//     }
//   },

//   generateSampleExcel: function(req, res) {
//     Gallery.generateSampleExcel(req.query, res);
//   },

//   generateExcel: function(req, res) {
//     Gallery.generateExcel(req.query, res);
//   }

export default router
