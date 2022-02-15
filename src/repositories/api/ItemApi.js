import API from "../../configs/ApiConfig";
import { getCookie } from "../../core/Cookies"
import BasketLocalStorage from "../localstorage/BasketLocalStorage"

class ItemApi {
  static async getAll() {
    // const items = [
    //   { id: 1, name: 'Jus Kucubung', price: 100000, category: { id: 1, name: "Jus" } },
    //   { id: 2, name: 'Jus Sirsak', price: 8000, category: { id: 1, name: "Jus" } },
    //   { id: 5, name: 'Jus Mangga', price: 9000, category: { id: 1, name: "Jus" } },
    //   { id: 3, name: 'Nasi Goreng', price: 20000, category: { id: 2, name: "Nasi" } },
    //   { id: 4, name: 'Ayam Bakar', price: 25000, category: { id: 2, name: "Nasi" } }
    // ]

    // let proccess = new Promise(resolve => setTimeout(() => resolve({
    //   status: true,
    //   data: items,
    //   message: "Data item berhasil diakses"
    // }), 600))
    
    // return await proccess
    
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
}

export default ItemApi