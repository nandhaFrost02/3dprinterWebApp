checkOut = (finalBillAmount) => {
    authState(user=>{
      if(user){
        payment(finalBillAmount,this.state.email,this.state.phoneNo,(paymentId)=>{
          this.setState(prevState=>({
          ...prevState,
          paymentId,
          orderStatus: prevState.orderStatus+1
          }),()=>{
          createOrder(this.state.paymentId,this.state.fullName,this.state.email,this.state.phoneNo,
            this.state.street,this.state.district,this.state.city,this.state.pincode,
            this.state.materialCode,this.state.materialColor,
            this.state.deliveryDate,this.state.fileInfo.name,this.state.expressCourier,finalBillAmount,"orderMade",
          (result)=>{
            if(result === this.state.paymentId){
              uploadToFolder(this.state.paymentId,this.state.fileText,(fileUploadResponse)=>{
                this.setState(prevState=>({
                  ...prevState,
                  fileUploadResponse,
                  loadingOrder:!prevState.loadingOrder
                }))
                if(fileUploadResponse==="success"){
                  ToasterSuccessMessage("your order is on the way, relax now!!!");
                  ToasterSuccessMessage("Ctrl+R, before tracking your order");
                }else if(fileUploadResponse === "Error"){
                  ToasterCustomMessage("success","Your order has be taken","top-right");
                  ToasterCustomMessage("warning","we shall contact you soon","top-right");
                }else{
                  ToasterErrorMessage();
                }
              })
            }else{
              ToasterCustomMessage("muted","Incase money is debited, will be created within 2 hours","bottom");
              ToasterErrorMessage();
            }
            })
          })
        })
      }else{
        ToasterCustomMessage("muted","login before you pay","top");
      }
    })
  }

  let razorpayment = (amount,email,contact,name,key,description,callback) => {
    try{
        let razorpay = new window.Razorpay({
            key,
            amount,
            description,
            name,
            prefill:{
                name,
                email,
                contact
            },
            handler: function (response){
                callback(response.razorpay_payment_id);
            }
        })
        razorpay.open();
    }catch(error){
        callback("Error in processing");
    }
}

let payment = (amount,email,contact,callback) => {
    amount = amount * 100;//paise conversion for razorpay compactability
    razorpayment(amount,email,contact,razorpayCheckoutTitle,razorpayKeyId,razorpaydescription,(paymentId)=>{
        callback(paymentId)
    });
}

//RazorPay constants
const razorpayCheckoutTitle="3dPrint with Froozen";
const razorpayKeyId="8VZqUERxyY88rw";
const razorpaydescription="A Froozen product";
