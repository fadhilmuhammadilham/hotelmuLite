import { getCookie } from "../../core/Cookies";
import API from "../../configs/ApiConfig";

class TypeApi {
  static async getAll() {
    let url = `${API.url}/resto/outlet`;
    let bearer = "Bearer " + getCookie('token')

    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      return await response.json();
    } catch (error) {
      console.log(error);
    }

  }
}

export default TypeApi