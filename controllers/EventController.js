const router = Router()
router.get("/", (req, res) => {
    EventModel.search(req.query, res.callback)
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
        EventModel.getOne(req.params, res.callback)
    }
)
router.post("/saveEvent", (req, res) => {
    EventModel.createEvent(req.body, res.callback)
})
router.put("/updateEvent/:id", (req, res) => {
    EventModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteEvent/:id", (req, res) => {
    EventModel.delete(req.params, res.callback)
})
// searchUpcomingEvent: function(req, res) {
//     Event.searchUpcomingEvent(req.body, res.callback);
//   },
//   searchPastEvent: function(req, res) {
//     Event.searchPastEvent(req.body, res.callback);
//   }
export default router
