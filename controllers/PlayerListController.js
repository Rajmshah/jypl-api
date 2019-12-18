const router = Router()

router.get("/", (req, res) => {
    PlayerListModel.search(req.query, res.callback)
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
        PlayerListModel.getOne(req.params, res.callback)
    }
)
router.post("/savePlayerList", (req, res) => {
    PlayerListModel.createPlayerList(req.body, res.callback)
})
router.put("/updatePlayerList/:id", (req, res) => {
    PlayerListModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deletePlayerList/:id", (req, res) => {
    PlayerListModel.delete(req.params, res.callback)
})
// router.post("/generateExcel", (req, res) => {
//     PlayerListModel.generateExcel(req.body, res)
// })
router.post("/uploadExcel", (req, res) => {
    PlayerListModel.uploadExcel(req.body, res.callback)
})

export default router
