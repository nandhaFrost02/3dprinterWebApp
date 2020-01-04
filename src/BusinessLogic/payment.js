import {costPerGram} from './FireStoreInteractions';

const standardDeliveryCost = parseInt(process.env.REACT_APP_STND_DELIVERY_COST);
const expressDeliveryCost = parseInt(process.env.REACT_APP_EXPRESS_DELIVERY_COST);

let priceToPrint = (gram,callback) =>{
    costPerGram(pricePerGram=>{
        if(pricePerGram !== "Error"){
            callback((Math.round((gram*pricePerGram) * 100) / 100).toFixed(2))
        }else{
            callback("Error")
        }
    })
}

let billAmountCalculator = (costToPrint,expressRequired,callback) =>{
    expressRequired = expressRequired === true ? expressDeliveryCost:standardDeliveryCost
    callback(costToPrint+expressRequired)
}



export {
    //razorpayment,
    priceToPrint,
    billAmountCalculator,
    //payment
}