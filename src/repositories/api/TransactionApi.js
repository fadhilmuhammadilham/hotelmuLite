import API from "../../configs/ApiConfig"
import { getCookie } from "../../core/Cookies"
import BasketLocalStorage from "../localstorage/BasketLocalStorage"
import ShiftLocalStorage from "../localstorage/ShiftLocalStorage"
import TransactionFilterLocalStorage from "../localstorage/TransactionFilterLocalStorage"
import TransactionLocalStorage from "../localstorage/TransactionLocalStorage"

class TransactionApi {
  static async getAll({limit, order}) {
    let url = `${API.url}/resto/transaction`
    let bearer = 'Bearer ' + getCookie('token')

    if(typeof limit != 'undefined'){
      url = `${API.url}/resto/transaction?limit=${limit}`
    }

    try{
      let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      })

      let json = await response.json();
      let status = {"Paid": "badge-success", "Draft": "badge-secondary", "Billed": "badge-info"}

      json.data = json.data.map(item => {
        item.total_prices = parseFloat(item.total_prices)
        item.status.badge = status[item.status.name]
        return item
      })

      return json

    }catch(err){
      console.log(err)
    }
  }

  static async summary() {
    let summaries = {
      sales_today: 1500000,
      transactions_today: 50
    }
    
    let proccess = new Promise(resolve => setTimeout(() => resolve({
      status: true,
      data: summaries,
      message: "Data summary transaction berhasil diakses"
    }), 600))

    return await proccess
  }

  static async getByFilter() {
    let bearer = 'Bearer ' + getCookie('token')
    let trx_number = TransactionFilterLocalStorage.get('code')
    let trx_date = TransactionFilterLocalStorage.get('date')
    let status = TransactionFilterLocalStorage.get('status')
    let url = `${API.url}/resto/transaction?limit=25`

    if(trx_number.length === 0 && trx_date.length > 0 && status.length > 0){
      url = url + `&filter[trx_date]=${trx_date}&filter[status]=${status}`
    }else if(trx_number.length > 0 && trx_date.length === 0 && status.length > 0){
      url = url + `&search[trx_number]=${trx_number}&filter[status]=${status}`
    }else if(trx_number.length > 0 && trx_date.length > 0 && status.length === 0){
      url = url + `&search[trx_number]=${trx_number}&filter[trx_date]=${trx_date}`
    }else if(trx_number.length > 0 && trx_date.length === 0 && status.length === 0){
      url = url + `&search[trx_number]=${trx_number}`
    }else if(trx_number.length === 0 && trx_date.length > 0 && status.length === 0){
      url = url + `&filter[trx_date]=${trx_date}`
    }else if(trx_number.length === 0 && trx_date.length === 0 && status.length > 0){
      url = url + `&filter[status]=${status}`
    }else{
      url = url + `&search[trx_number]=${trx_number}&filter[trx_date]=${trx_date}&filter[status]=${status}`
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
      let status = {"Paid": "badge-success", "Draft": "badge-secondary", "Billed": "badge-info"}

      json.data = json.data.map(item => {
        item.total_prices = parseFloat(item.total_prices)
        item.status.badge = status[item.status.name]
        return item
      }) 

      return json

    } catch (error) {
      console.log(error)
    }
  }

  static async save(number_of_guest) {
    let url = `${API.url}/resto/transaction`
    let bearer = 'Bearer ' + getCookie('token')
    let d = new Date()
    let month = d.getMonth() + 1
    let date = [d.getFullYear(), month.toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':')
    let shift_id = ShiftLocalStorage.get('id')
    let guest_id = BasketLocalStorage.get('guest').hasOwnProperty('id') ? BasketLocalStorage.get('guest').id : 0
    let table_id = BasketLocalStorage.get('table').id
    let outlet_id = parseInt(BasketLocalStorage.get('type').id)
    let nog = parseInt(number_of_guest)
    let items_data = BasketLocalStorage.get('items')
    let items = []

    items_data.forEach((item) => {
      items.push({item_id: item.id, qty: item.qty, discount: 0, note: ""})
    })

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trx_date: date,
          shift_id: shift_id,
          guest_id: guest_id,
          waiter_id: 2,
          table_id: table_id,
          outlet_id: outlet_id,
          number_of_guest: nog,
          status: 0,
          items: items
        })
      })

      let json = await response.json();

      return json;
    } catch (error) {
      console.log(error)
    }
  }

  static async detail() {
    let trx_id = TransactionLocalStorage.get('id')
    let url = `${API.url}/resto/transaction/${trx_id}`
    let bearer = 'Bearer ' + getCookie('token')

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

export default TransactionApi