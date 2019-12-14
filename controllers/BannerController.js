const router = Router()
router.get("/", (req, res) => {
    BannerModel.search(req.query, res.callback)
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
        BannerModel.getOne(req.params, res.callback)
    }
),
router.get(
    "/getBannerByPageName/:pageName",
    ValidateRequest({
        params: {
            type: "string",
            properties: {
                pageName: {
                    type: "string"
                }
            }
        }
    }),
    (req, res) => {
        Banner.findOne({
            pageName: req.params.pageName
        }).exec(res.callback)
    }
),
router.post("/saveBanner", (req, res) => {
    BannerModel.createBanner(req.body, res.callback)
})
router.put("/updateBanner/:id", (req, res) => {
    BannerModel.updateData(req.params, req.body, res.callback)
})
router.delete("/deleteBanner/:id", (req, res) => {
    BannerModel.delete(req.params, res.callback)
})

export default router
