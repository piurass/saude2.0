require('dotenv').config();

class ChainApi {
    static init() {
        const baseUrl = process.env.BASEURLBLOCK;
        const headers = 'Content-Type: application/json';

        return { baseUrl, headers };
    }
}

export default ChainApi;
