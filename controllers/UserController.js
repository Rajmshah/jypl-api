const router = Router()
router.get("/", (req, res) => {
    UserModel.search(req.query, res.callback)
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
        UserModel.getOne(req.params, res.callback)
    }
)
router.get("/getOneByToken/:token", (req, res) => {
    UserModel.getOneByToken(req.params, res.callback)
})
router.post("/saveUser", (req, res) => {
    UserModel.createUser(req.body, res.callback)
})
router.put("/updateUser/:id", (req, res) => {
    UserModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteUser/:id", (req, res) => {
    UserModel.delete(req.params, res.callback)
})
router.post("/login", (req, res) => {
    UserModel.login(req.body, res.callback)
})
router.post("/generateExcel", (req, res) => {
    UserModel.generateExcel(req.body, res)
})

export default router
