import { getCookie } from "../../core/Cookies";

class TypeApi {
  static async getAll() {
    // const types = [
    //   {id: 1, name: 'Dine In'},
    //   {id: 2, name: 'Room Service'},
    //   {id: 3, name: 'Bunquet'},
    // ]

    // let proccess = new Promise(resolve => setTimeout(() => resolve({
    //   status: true,
    //   data: types,
    //   message: "Data type berhasil diakses"
    // }), 500))

    // return await proccess

    let url = "https://api.hotelmu.id/pos/resto/outlet";
    let bearer = "Bearer " + getCookie('token')

    let response = await fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
    });

    return await response.json();
  }
}

export default TypeApi