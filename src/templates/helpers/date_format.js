export default (date, type) => {
    let d = new Date(date)
    let date_arr = date.split("-");

    let month_arr = {
        '01': 'Januari',
        '02': 'Februari',
        '03': 'Maret',
        '04': 'April',
        '05': 'Mei',
        '06': 'Juni',
        '07': 'Juli',
        '08': 'Agustus',
        '09': 'September',
        '10': 'Oktober',
        '11': 'November',
        '12': 'Desember',
    }

    let day = d.toLocaleDateString("id-ID", {weekday: 'long'})
    let month = month_arr[date_arr[1]]

    if(type === "Full"){
        return day + ', ' + date_arr[2] + ' ' + month
    }else{
        return month + ' ' + date_arr[0]
    }
}