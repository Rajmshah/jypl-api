const router = Router()
router.get("/", (req, res) => {
    PressModel.search(req.query, res.callback)
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
        PressModel.getOne(req.params, res.callback)
    }
)
router.post("/savePress", (req, res) => {
    PressModel.createPress(req.body, res.callback)
})
router.put("/updatePress/:id", (req, res) => {
    PressModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deletePress/:id", (req, res) => {
    PressModel.delete(req.params, res.callback)
})
// searchNewsAndUpdates: function(req, res) {
//     Press.searchNewsAndUpdates(req.body, res.callback);
//   }
export default router
