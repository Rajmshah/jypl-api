const router = Router()
router.get("/", (req, res) => {
    ContactModel.search(req.query, res.callback)
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
        ContactModel.getOne(req.params, res.callback)
    }
)
router.get(
    "/getOneSpecialContact/:id",
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
        ContactModel.getOneContact(req.params, res.callback)
    }
)
router.post("/saveContact", (req, res) => {
    ContactModel.createContact(req.body, res.callback)
})
router.put("/updateContact/:id", (req, res) => {
    ContactModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteContact/:id", (req, res) => {
    ContactModel.delete(req.params, res.callback)
})

export default router
