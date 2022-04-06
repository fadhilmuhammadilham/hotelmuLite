import Page from "./Page";
import $ from "jquery";
import ReportApi from "../repositories/api/ReportApi";
import monthlyReport from "../templates/report-monthly.handlebars"
import reportItem from "../templates/report-item.handlebars"

class ReportMonthly extends Page {
    constructor(params) {
        super(params)
    }

    async getRecent() {
        try {
            let res = await ReportApi.getRecent();

            return res.data
        } catch (error) {
            console.log(error);            
        }
    }

    async getMonthly(year, month){
        try {
            let res = await ReportApi.getMonthly(year, month)

            return res
        } catch (error) {
            console.log(error);            
        }
    }

    async action(){

        const recentData = await this.getRecent();

        // Initiate Date
        let d = new Date()
        let bulan = [
            "Januari", "Februari", "Maret", "April", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ]
        $('#bulan').text(bulan[d.getMonth()] + ' ' + d.getFullYear())
        let m = d.getMonth + 1;
        let year = d.getFullYear();

        for(let i = year; i > year - 10; i--) {
            $('select#tahun-selected').append('<option value="'+ i +'">'+i+'</option>')
        }
        
        $('.item-transaksi').html(reportItem({transaction_data: recentData, type: "month"}))

        $('#select-btn').on('click', async (e) => {
            let month_selected = $('#bulan-selected option:selected').val()
            let year_selected = $('#tahun-selected option:selected').val()

            let res = await this.getMonthly(year_selected, month_selected)
            console.log(res);
            if(res.status){
                $('#bulan').text('' + $('#bulan-selected option:selected').text() + ' ' + year_selected);
                $('.item-transaksi').html(reportItem({transaction_data: res.data, type: "month"}))
            }
        })

        $('#eraser-btn').on('click', (e) => {
            window.location.reload()
        })
    }

    render() {
        return monthlyReport()
    }
}

export default ReportMonthly