class DateCustom {
  static getNowFormated() {
    const d = new Date()
    let month = d.getMonth() + 1
    return [d.getFullYear(), month.toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':')
  }
}

export default DateCustom