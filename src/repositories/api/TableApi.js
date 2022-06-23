import API from "../../configs/ApiConfig";
import { getCookie } from "../../core/Cookies";

class TableApi {
  static async getAll(outletId) {
    let bearer = 'Bearer ' + getCookie('token')
    let url = `${API.url}/resto/table?outlet_id=${outletId}`

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