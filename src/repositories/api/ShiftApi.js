import API from "../../configs/ApiConfig";
import { getCookie } from "../../core/Cookies";

class ShiftApi {
    static async open(begining_balance) {
        let url = `${API.url}/resto/shift/open`;
        let bearer = 'Bearer ' + getCookie('token');

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({ begining_balance: begining_balance })
            })
    
            let json = await response.json();
    
            return json
        } catch (error) {
            console.log(error);
        }

    }

    static async close(id) {
        let url = `${API.url}/resto/shift/${id}/close`;
        let bearer = 'Bearer ' + getCookie('token');

        try {
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
        } catch (error) {
            console.log(error);
        }

    }
}

export default ShiftApi