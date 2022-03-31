import Page from "./Page";
import $ from "jquery";
import transactionFilterView from "../templates/transaction-filter.handlebars"
import TransactionFilterService from "../services/TransactionFilterService";
import TransactionFilterLocalStorage from "../repositories/localstorage/TransactionFilterLocalStorage";

class TransactionFilter extends Page {
    constructor(params){
        super(params)
    }

    action() {
        const filterService = new TransactionFilterService();
        let is_filtered = TransactionFilterLocalStorage.getAll()
        
        let status_id = []
        let status

        if(Object.keys(is_filtered).length > 0)
        {
            let status_filter = is_filtered.status
            let arr = status_filter.split(',')
            
            $('#kode_transaksi').val(is_filtered.code)
            $('#tanggal').val(is_filtered.date)
            
            $('.status-transaksi').each((index, item) => {
                let status_code = $(item).data('id')
                if(arr.includes(status_code.toString())){
                    status_id.push(status_code)
                    status = status_id.join(',')
                    filterService.setStatus(status)
                    $(item).addClass('active')
                    console.log(status_id)
                }
            })
            
        }

        $('.status-transaksi').on('click', (e) => {
            if($(e.currentTarget).hasClass('active')) {
                $(e.currentTarget).removeClass('active')
                status_id = $.grep(status_id, (value) => {
                    return value != $(e.currentTarget).data('id')
                })
                status = status_id.join(',')
                filterService.setStatus(status)
            }else{
                $(e.currentTarget).addClass('active')
                status_id.push($(e.currentTarget).data('id'))
                status = status_id.join(',')
                filterService.setStatus(status)
            }
        })

        $('#btn-filter').on('click', (e) => {

            console.log($('#kode_transaksi').val().length)
            console.log($('#tanggal').val().length)
            console.log(status_id.length)

            if($('#kode_transaksi').val().length > 0 || $('#tanggal').val().length > 0 || status_id.length > 0){
                filterService.setStatus(status)
                filterService.setCode($('#kode_transaksi').val())
                filterService.setDate($('#tanggal').val())
                window.history.back();
            }else{
                TransactionFilterLocalStorage.removeAll();
                window.history.back();
            }
        })
    }

    render() {
        return transactionFilterView();
    }
}

export default TransactionFilter