const router = Router()
router.get("/", (req, res) => {
    PasswordModel.search(req.query, res.callback)
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
        PasswordModel.getOne(req.params, res.callback)
    }
)
router.post("/savePassword", (req, res) => {
    PasswordModel.createPassword(req.body, res.callback)
})
router.put("/updatePassword/:id", (req, res) => {
    PasswordModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deletePassword/:id", (req, res) => {
    PasswordModel.delete(req.params, res.callback)
})

export default router
