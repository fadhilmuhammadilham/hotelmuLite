import { isNumeric } from "jquery"
import ConfigLocalStorage from "../localstorage/ConfigLocalStorage";

class UserApi {
  static async login(username, password) {
    // const users = [
    //   {username: 'fatah', password: '123456', name: 'Fatah'},
    //   {username: 'anang', password: '123456', name: 'Anang'},
    //   {username: 'daffa', password: '123456', name: 'Daffa'},
    // ]
    
    // let loginProccess = new Promise(resolve => setTimeout(() => {
    //   let user = users.find(user => username==user.username && password == user.password)
    //   let d = new Date()
    //   resolve(user ? { status: true, data: { token: '1234567890', expire: (d.getTime() + (0.5 * 24 * 60 * 60 * 1000)), userdata: {username: user.username, name: user.name}}, message: "Login berhasil" }: { status: false, message: "Login gagal" })
    // }, 1000))

    let url = "https://api.hotelmu.id/pos/resto/login";
    let hotelId = ConfigLocalStorage.get('hotelId');

    let response = await fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({hotel_id: hotelId, username: username, password: password}),
    })

    let json = await response.json();

    return json
  }
}

export default UserApi