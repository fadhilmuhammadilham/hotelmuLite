import API from "../../configs/ApiConfig";
import { getCookie } from "../../core/Cookies"
import BasketLocalStorage from "../localstorage/BasketLocalStorage"
import TransactionLocalStorage from "../localstorage/TransactionLocalStorage";

class ItemApi {
  static async getAll() {
    
    let type = BasketLocalStorage.get('type')
    let url = `${API.url}/resto/item?outlet_id=${type.id}`
    let bearer = "Bearer " + getCookie('token');

    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      })
  
      let json = await response.json();
  
      return json;
    } catch (error) {
      console.log(error) 
    }
  }

  static async getFromTransaction() {

    let outlet_id = TransactionLocalStorage.get('outlet_id')
    let url = `${API.url}/resto/item?outlet_id=${outlet_id}`
    let bearer = "Bearer " + getCookie('token')
    
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

      return json
    } catch (error) {
      console.log(error);
    }
  }
}

export default ItemApi