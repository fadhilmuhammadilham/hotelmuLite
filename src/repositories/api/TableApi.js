import API from "../../configs/ApiConfig";
import { getCookie } from "../../core/Cookies";
import BasketLocalStorage from "../localstorage/BasketLocalStorage";
import TransactionLocalStorage from "../localstorage/TransactionLocalStorage";

class TableApi {
    static async getAll(outlet) {
        let outlet_id = BasketLocalStorage.get('type')
        let outlet_id_trx = TransactionLocalStorage.get('outlet_id')
        let bearer = 'Bearer ' + getCookie('token')
        let url = `${API.url}/resto/table`

        if(outlet_id.hasOwnProperty('id')){
            url = `${API.url}/resto/table?outlet_id=${outlet_id.id}`
        }else if(typeof outlet != 'undefined'){
            url = `${API.url}/resto/table?outlet_id=${outlet}`
        }else{
            url = `${API.url}/resto/table?outlet_id=${outlet_id_trx}`
        }

        try {
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
        } catch (error) {
            console.log(error);
        }
    }
}

export default TableApi;