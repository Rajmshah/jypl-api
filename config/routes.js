/**
 * Define Index Routes Here
 */

const router = Router()
router.get("/", (req, res) => {
    res.render("home", {
        name: "JYPL"
    })
})
export default router
