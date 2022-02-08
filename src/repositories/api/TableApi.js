import { getCookie } from "../../core/Cookies";
import BasketLocalStorage from "../localstorage/BasketLocalStorage";

class TableApi {
    static async getAll() {
        let outlet_id = BasketLocalStorage.get('type')
        let bearer = 'Bearer ' + getCookie('token')
        let url = `https://api.hotelmu.id/pos/resto/table?outlet_id=${outlet_id.id}`

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': bearer,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        let json = await response.json()

        return json;
    }
}

export default TableApi;