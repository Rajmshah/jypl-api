const router = Router()
router.get("/", (req, res) => {
    SettingModel.search(req.query, res.callback)
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
        SettingModel.getOne(req.params, res.callback)
    }
)
router.post("/saveSetting", (req, res) => {
    SettingModel.createSetting(req.body, res.callback)
})
router.put("/updateSetting/:id", (req, res) => {
    SettingModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteSetting/:id", (req, res) => {
    SettingModel.delete(req.params, res.callback)
})
router.post("/emailReader", (req, res) => {
    var isfile2 = fs.existsSync("./views/" + req.body.filename)
    console.log("isfile2", isfile2)
    if (isfile2) {
        res.render(req.body.filename, req.body)
    } else {
        res.json({
            value: false,
            message: "Please provide params"
        })
    }
})

export default router
