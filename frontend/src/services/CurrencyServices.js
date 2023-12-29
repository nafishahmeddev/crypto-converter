import BaseRequest from "@app/services/BaseRequest";
const { http } = new BaseRequest("/currencies");
export default class CurrencyServices {
    static latest = () => http.get("/latest");
    static convert = (data) => http.post("/convert", data);
}