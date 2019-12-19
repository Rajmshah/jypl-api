const router = Router()
router.get("/", (req, res) => {
    TeamListModel.search(req.query, res.callback)
})
router.get("/searchTeamList", (req, res) => {
    TeamListModel.searchTeamList(req.query, res.callback)
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
        TeamListModel.getOne(req.params, res.callback)
    }
)
router.post("/saveTeamList", (req, res) => {
    TeamListModel.createTeamList(req.body, res.callback)
})
router.put("/updateTeamList/:id", (req, res) => {
    TeamListModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteTeamList/:id", (req, res) => {
    TeamListModel.delete(req.params, res.callback)
})

export default router
