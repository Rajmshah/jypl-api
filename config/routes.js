/**
 * Define Index Routes Here
 */

const router = Router()
router.get("/", (req, res) => {
    res.render("home", {
        name: "MTC MARUDHAR CUP"
    })
})
export default router
