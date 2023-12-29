
const axios = require("axios");

const latest = () => {
    return axios.get(process.env.COINMARKET_URL + "/v1/cryptocurrency/listings/latest", {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKET_KEY,
        }
    }).then(res => {
        return res.data.data.map(record => ({
            id: record.id,
            name: record.name,
            symbol: record.symbol,
            currencies: Object.keys(record.quote)
        }));
    });
}

const convert = (id, currency) => {
    return axios.get(process.env.COINMARKET_URL + `/v1/cryptocurrency/quotes/latest?id=${id}`, {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKET_KEY,
        }
    }).then(res => {
        const record = res.data.data[id];
        const rate = record?.["quote"]?.[currency]
        if (!rate) throw new Error("Currency not supported");
        return {
            rate :  rate.price
        }
    });
}

module.exports = {
    latest, convert
}
