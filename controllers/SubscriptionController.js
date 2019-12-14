const router = Router()
router.get("/", (req, res) => {
    SubscriptionModel.search(req.query, res.callback)
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
        SubscriptionModel.getOne(req.params, res.callback)
    }
)
router.post("/saveSubscription", (req, res) => {
    SubscriptionModel.createSubscription(req.body, res.callback)
})
router.put("/updateSubscription/:id", (req, res) => {
    SubscriptionModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteSubscription/:id", (req, res) => {
    SubscriptionModel.delete(req.params, res.callback)
})

export default router
