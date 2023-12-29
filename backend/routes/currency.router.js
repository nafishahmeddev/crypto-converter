const { Router } = require("express");
const CoinMarketHelper = require("./../helpers/coin-market.helper");

const router = Router();

router.get("/latest", async (req, res) => {
    try {
        const currencies = await CoinMarketHelper.latest();
        return res.json({
            message: "Successful",
            result: {
                currencies
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
        })
    }
})

router.post("/convert", async (req, res) => {
    try {
        const id = req.body.id;
        const currency = req.body.currency;
        const amount = Number(req.body.amount);

        const {rate} = await CoinMarketHelper.convert(id, currency);
        const price = rate * amount;
        return res.json({
            message: "Successful",
            result: {
                id: id,
                currency: currency,
                amount: amount,
                rate: rate,
                price: price
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
        })
    }
})

module.exports = router;