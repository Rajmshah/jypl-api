const router = Router()
router.get("/", (req, res) => {
    AboutModel.search(req.query, res.callback)
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
        AboutModel.getOne(req.params, res.callback)
    }
)
router.post("/saveAbout", (req, res) => {
    AboutModel.createAbout(req.body, res.callback)
})
router.put("/updateAbout/:id", (req, res) => {
    AboutModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteAbout/:id", (req, res) => {
    AboutModel.delete(req.params, res.callback)
})

export default router
