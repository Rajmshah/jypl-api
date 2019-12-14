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

export default router
