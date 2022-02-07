import { getCookie } from "../../core/Cookies";

class ShiftApi {
    static async open(begining_balance) {
        let url = "https://api.hotelmu.id/pos/resto/shift/open";
        let bearer = 'Bearer ' + getCookie('token');

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({begining_balance: begining_balance})
        })

        let json = await response.json();

        return json
    }

    static async close(id) {
        let url = `https://api.hotelmu.id/pos/resto/shift/${id}/close`;
        let bearer = 'Bearer ' + getCookie('token');

        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': bearer,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        let json = await response.json();

        return json
    }
}

export default ShiftApi