import axios from "axios";
class BaseRequest {
    http;
    _http;
    constructor(base = "/") {
        const _uri = import.meta.env.VITE_API_ENDPOINT;
        const _uri_with_base = `${import.meta.env.VITE_API_ENDPOINT}${base}`;

        this._http = this.createHttp(_uri);
        this.http = this.createHttp(_uri_with_base);
    }

    createHttp(_uri) {
        const _axios = axios.create({ baseURL: _uri });
        _axios.interceptors.request.use(
            function (config) {
                // Do something before request is sent
                const headers = {};
                config.headers = headers;
                return config;
            },
            function (error) {
                // Do something with request error
                return Promise.reject(error);
            }
        );

        _axios.interceptors.response.use(
            (response) => {
                if (response.config.parse) {
                    //perform the manipulation here and change the response object
                    if (response.status !== 200) return Promise.reject(new Error(response.data.message));
                }
                if (response.data) return Promise.resolve(response.data);
                return response;
            },
            async (error) => {
                error.message = error?.response?.data?.message ?? error.message
                return Promise.reject(new Error(error.message));
            }
        );
        return _axios;
    }
}

export default BaseRequest;