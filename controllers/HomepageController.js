const router = Router()
router.get("/", (req, res) => {
    HomepageModel.search(req.query, res.callback)
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
        HomepageModel.getOne(req.params, res.callback)
    }
)
router.post("/saveHomepage", (req, res) => {
    HomepageModel.createHomepage(req.body, res.callback)
})
router.put("/updateHomepage/:id", (req, res) => {
    HomepageModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteHomepage/:id", (req, res) => {
    HomepageModel.delete(req.params, res.callback)
})

export default router
