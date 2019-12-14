const router = Router()
router.get("/", (req, res) => {
    SponsorModel.search(req.query, res.callback)
})
router.get("/getList", (req, res) => {
    SponsorModel.getList(req.query, res.callback)
})
router.get("/getAll", (req, res) => {
    SponsorModel.getAll(req.query, res.callback)
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
        SponsorModel.getOne(req.params, res.callback)
    }
)
router.post("/saveSponsor", (req, res) => {
    SponsorModel.createSponsor(req.body, res.callback)
})
router.put("/updateSponsor/:id", (req, res) => {
    SponsorModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteSponsor/:id", (req, res) => {
    SponsorModel.delete(req.params, res.callback)
})
router.get("getlist", (req, res) => {
    Sponsor.find({ active: true })
        .sort({ order: 1 })
        .exec(res.callback)
})
export default router
