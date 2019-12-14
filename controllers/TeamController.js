const router = Router()

router.get("/", (req, res) => {
    TeamModel.search(req.query, res.callback)
})
router.get("/getAll", (req, res) => {
    TeamModel.getAll(req.query, res.callback)
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
        TeamModel.getOne(req.params, res.callback)
    }
)
router.get("/getOneByUser/:user", (req, res) => {
    TeamModel.getOneByUser(req.params, res.callback)
})
router.post("/saveTeam", (req, res) => {
    TeamModel.createTeam(req.body, res.callback)
})
router.put("/updateTeam/:id", (req, res) => {
    TeamModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteTeam/:id", (req, res) => {
    TeamModel.delete(req.params, res.callback)
})

export default router
