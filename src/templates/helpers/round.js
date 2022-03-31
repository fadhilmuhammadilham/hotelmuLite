export default (payment, multiple) => {
    var min = 0
    var round = 0
    var remains = payment % multiple

    if(remains < multiple && remains > 0)
    {
        min = multiple - remains
        round = payment + min
    } 
    else
    {
        round = payment
    }

    Math.floor(round)
    return (round - payment)
}