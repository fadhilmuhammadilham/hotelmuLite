import API from "../../configs/ApiConfig";

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
}

export default HotelApi