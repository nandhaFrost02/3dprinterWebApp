const tickMark="&#10003;";
const wrongMark="&#10007;";

const INSTAMOJOFUNCTION=process.env.REACT_APP_ENDPOINT_INSTAMOJO_CREATEPAYMENT

//Delivery options
//Quicker delivery => 7 days
//Standard delivery => 12 days
const daysForDelivery = (expresDelivery) => {
    return expresDelivery === true ? 7:12;
}

export {
    tickMark,
    wrongMark,
    daysForDelivery,
    INSTAMOJOFUNCTION
}