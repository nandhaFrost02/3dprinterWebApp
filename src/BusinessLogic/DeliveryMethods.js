import {daysForDelivery} from './../staticData/constants'

let expectedDeliveryDate = (date, expressDelivery,callback) => {//Deprecated - not working as expected
    var days = daysForDelivery(expressDelivery)
    var result = new Date(date);
    result.setDate(result.getDate()+days);
    callback(result.getDate()+"-"+(result.getMonth()+1)+"-"+result.getFullYear());
}

let deliveryDateEstimate = (expressDelivery) =>{
        var dt = new Date();
        dt.setDate(dt.getDate() + daysForDelivery(expressDelivery));
        return dt.getDate()+"-"+(dt.getMonth()+1)+"-"+dt.getFullYear();
}

export {
    expectedDeliveryDate,
    deliveryDateEstimate
}