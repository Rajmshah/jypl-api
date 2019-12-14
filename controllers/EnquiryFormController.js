const router = Router()
router.get("/", (req, res) => {
    EnquiryFormModel.search(req.query, res.callback)
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
        EnquiryFormModel.getOne(req.params, res.callback)
    }
)
router.post("/saveEnquiryForm", (req, res) => {
    EnquiryFormModel.createEnquiryForm(req.body, res.callback)
})
router.put("/updateEnquiryForm/:id", (req, res) => {
    EnquiryFormModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteEnquiryForm/:id", (req, res) => {
    EnquiryFormModel.delete(req.params, res.callback)
})

export default router
