import API from "../../configs/ApiConfig";
import { getCookie } from "../../core/Cookies";

class HotelApi {
  static async signin(hotelId, securityCode) {

    let url = `${API.url}/setup`;

    let response = await fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hotel_id: hotelId, security_code: securityCode })
    })

    let json = await response.json();

    return json;
  }

  static async setting() {

    let url = `${API.url}/setting`
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

export default HotelApi