import Page from "./Page";
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage";
import $ from "jquery"
import closeShift from "../templates/shift-close.handlebars"

class ShiftClose extends Page {
    constructor(params) {
        super(params)
    }

    action(){
        $('#close-shift').on('click', function() {
            ShiftLocalStorage.removeAll();
            window.history.back();
        })
    }

    render(){
        return closeShift({shift: ShiftLocalStorage.getAll()})
    }
}

export default ShiftClose