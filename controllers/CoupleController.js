const router = Router()

router.get("/", (req, res) => {
    CoupleModel.search(req.query, res.callback)
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
        CoupleModel.getOne(req.params, res.callback)
    }
)
router.get("/checkCoupleRegisteredOrNot", (req, res) => {
    CoupleModel.checkCoupleRegisteredOrNot(req.query, res.callback)
})
router.post("/saveCouple", (req, res) => {
    CoupleModel.createCouple(req.body, res.callback)
})
router.put("/updateCouple/:id", (req, res) => {
    CoupleModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteCouple/:id", (req, res) => {
    CoupleModel.delete(req.params, res.callback)
})
router.post("/generateExcel", (req, res) => {
    CoupleModel.generateExcel(req.body, res)
})
router.post("/generateWelcomeMail", (req, res) => {
    CoupleModel.generateWelcomeMail(req.body, res.callback)
})
router.post("/generateInvoiceMail", (req, res) => {
    CoupleModel.generateInvoiceMail(req.body, res.callback)
})
router.post("/generateInvoicePdf", (req, res) => {
    CoupleModel.generateInvoicePdf(req.body, res.callback)
})

export default router
