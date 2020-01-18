const router = Router()

router.get("/", (req, res) => {
    PlayerModel.search(req.query, res.callback)
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
        PlayerModel.getOne(req.params, res.callback)
    }
)
router.get("/checkPlayerRegisteredOrNot", (req, res) => {
    PlayerModel.checkPlayerRegisteredOrNot(req.query, res.callback)
})
router.post("/savePlayer", (req, res) => {
    PlayerModel.createPlayer(req.body, res.callback)
})
router.put("/updatePlayer/:id", (req, res) => {
    PlayerModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deletePlayer/:id", (req, res) => {
    PlayerModel.delete(req.params, res.callback)
})
router.post("/generateExcel", (req, res) => {
    PlayerModel.generateExcel(req.body, res)
})
router.post("/generateWelcomeMail", (req, res) => {
    PlayerModel.generateWelcomeMail(req.body, res.callback)
})
router.post("/generateInvoicePdf", (req, res) => {
    PlayerModel.generateInvoicePdf(req.body, res.callback)
})

export default router
