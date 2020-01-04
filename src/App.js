import React from 'react';
import {Header,Footer} from './components/Layout';
import {Card1, Card2, Card3, Card4} from './components/Cards';
import {fileInfo,STLHandler,textCopy} from './BusinessLogic/FileHandler';
import { priceToPrint,billAmountCalculator} from './BusinessLogic/payment';
import {expectedDeliveryDate} from './BusinessLogic/DeliveryMethods'
import Context from './Context';
import {densityValue,defaultOrderStatus,defaultPrecentPogress,defaultFileInfo,defaultFileText,defaultFileStatus,defaultMaterialCode,defaultMaterialColor,defaultDensity,defaultBusinessInfo,defaultDisplayEstimate,defaultBound,defaultCostToPrint} from './BusinessLogic/PublicStaticData';
import {createOrder,appAuth,authState,uploadToFolder} from './BusinessLogic/FireStoreInteractions';
import {ToasterSuccessMessage,ToasterCustomMessage,ToasterErrorMessage} from './components/Alerts'
import {Instamojo} from './BusinessLogic/MojoPayment';
import {INSTAMOJOFUNCTION} from './staticData/constants';
import {WelcomeModal} from './components/Modals'

export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      //For UI purpose
      welcomeModal:true,//Welcome's user
      orderStatus: 1,//step1
      precentProgress : 0,//0 percent at start
  
      //For file pharsing
      uploadedFileResult: null,
      fileInfo: {},//{name,lastModifiedDate,lastModified,size}
      fileText: "",//Empty text
      fileBuffer:null,
      fileStatus: 0,//0 - empty,1 - updating, 2 - ready for use, 3 - error *HARD-CODED HANDLE*
      fileReadyforPriceUpdate: false,//if user uploads a file without loggin in this catches the file
      pleaseLoginWarningWithFileHold:false,
      textCopyReRun:false,

      materialCode: "PLA",//Default to PLA
      materialColor: "yellow",
      density:1.25,//default Density
      
      //STL pharsed informations
      businessInfo:{},//volume_cm3,weight_gm,boundingBox_mm(l,b,h),area_m,centerOfMass_mm(x,y,z)
      displayEstimate:false,//true only when estimate is completed
      bound: {},
      costToPrint: 0.00,//comes from server
      deliveryDate:0,
      deliveryCharge:52.00,
      billAmount:0.00,
      paymentId:"",

      //for tracking file uploading into Storage
      loadingOrder:true,
      fileUploadResponse:"yetToUpload",//yetToUpload,error,failed,uploading,success
      //form validation and form data
      fullName: "",
      fullNameValidator: null,
      phoneNo: "",
      phoneNoValidator: null,
      email: "",
      emailValidator: null,
      street: "",
      streetValidator: null,
      city: "",
      cityValidator: null,
      district: "",
      districtValidator: null,
      pincode: "",
      pincodeValidator: null,
      expressCourier: null,
      uid: "",
      displayEstimateSpinners:false,
    }
    appAuth.onAuthStateChanged(user=>{
      if(user){
        this.setState(prevState=>({...prevState,pleaseLoginWarningWithFileHold:false}))//Incase if user is prompted earlier it will be cleared
        if(this.state.fileReadyforPriceUpdate){
          priceToPrint(this.state.businessInfo.weight.toFixed(3),(costToPrint)=>{
            if(costToPrint !== "Error"){
              this.setState(prevState=>({
                ...prevState,
                displayEstimateSpinners:false,
                costToPrint
              }))
            }else{ 
              ToasterErrorMessage()
            }
          })
        }
        if(this.state.textCopyReRun){
          textCopy(this.state.uploadedFileResult,(result,status)=>{
            if(status==="Ok"){
              this.setState(prevState=>({
                ...prevState,
                displayEstimate: true,
                fileText:result.fileText,
              }))
            }else if(status==="LOADING"){
              result += 50
              this.setState(prevState=>({
                ...prevState,
                precentProgress:result
              }))
            }
          })
        }
      }
    })  
  }
  componentDidMount(){
    expectedDeliveryDate(new Date(),false,(deliveryDate)=>{
      this.setState(prevState=>({
        ...prevState,
        deliveryDate
      }))
    })
    billAmountCalculator(this.state.costToPrint,false,(billAmount)=>{
      this.setState(prevState=>({
        ...prevState,
        billAmount
      }))
    })
  }

  componentDidUpdate = () => {
    if (this.state.orderStatus>=2) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }
  openWelcomeModal=()=>{
    this.setState(prevState=>({
      ...prevState,
      welcomeModal:!prevState.welcomeModal
    }))
  }
  closeWelcomeModal=()=>{
    this.setState(prevState=>({
      ...prevState,
      welcomeModal:!prevState.welcomeModal
    }))
  }
  /**
   * Triggeres only if file is loaded successfully
   */
  businessInfoUpdater = ()=>{//bussiness function inside local function for code re-useablility
    return new Promise((resolve,reject)=>{//Used promise for resolving unwanted files being processed
      if(this.state.fileStatus === 2){
        this.setState(prevState=>({...prevState,displayEstimateSpinners:true}))
        STLHandler(this.state.materialCode,this.state.fileBuffer,(stlInfo,message)=>{
          let bound = {
            "boundX": stlInfo.boundingBox[0],
            "boundY": stlInfo.boundingBox[1],
            "boundZ": stlInfo.boundingBox[2]
          }
          if(message==="OK"){
           this.setState(prevState=>({
             ...prevState,
             businessInfo: stlInfo,
             bound: bound
           }),()=>{
            authState(user=>{
              if(user){
                priceToPrint(this.state.businessInfo.weight.toFixed(3),(costToPrint)=>{
                  if(costToPrint !== "Error"){
                    this.setState(prevState=>({
                      ...prevState,
                      displayEstimateSpinners:false,
                      costToPrint
                    }),()=>{resolve()})
                  }else{ 
                    ToasterErrorMessage()
                    reject("Error")
                  }
                })
              }else{
                ToasterSuccessMessage("Please login to continue")
                this.setState(prevState=>({
                  ...prevState,
                  fileReadyforPriceUpdate: true,
                  pleaseLoginWarningWithFileHold:true,
                  displayEstimateSpinners:false,
                  textCopyReRun:true
                }))
              }
            })
        })
        }else{
          reject("error")
        }
        })
    }
    })
  }
  
  filePharser = (e) =>{//Add exception for handling esc
    let file = e.target.files[0]
    this.setState(prevState=>({
      ...prevState,
      uploadedFileResult: file
    }),()=>{
      fileInfo(this.state.uploadedFileResult,(result,status)=>{
        this.setState(prevState=>({...prevState,displayEstimateSpinners:true}))
        if(status === "Ok"){
          this.setState(prevState=>({...prevState,fileBuffer:""}),()=>{
          this.setState(prevState=>({
            ...prevState,
            fileBuffer: result.fileBuffer,
            fileInfo: result.fileInfo,
          }),()=>{
            this.setState(prevState=>({...prevState,fileStatus:2}),()=>{
             this.businessInfoUpdater()
             .then(()=>{
               ToasterSuccessMessage("Your file is valid")
               this.setState(prevState=>({...prevState,fileText:""}),()=>{
                textCopy(this.state.uploadedFileResult,(result,status)=>{
                  if(status==="Ok"){
                    this.setState(prevState=>({
                      ...prevState,
                      displayEstimate: true,
                      fileText:result.fileText,
                      fileRemoveButton: true
                    }))
                  }else if(status==="LOADING"){
                    result += 50
                    this.setState(prevState=>({
                      ...prevState,
                      precentProgress:result
                    }))
                  }
                })
               }) 
              })
             .catch(error=>{
               ToasterCustomMessage("muted","STL file is not valid or not an STL file","top");
               this.setState(prevState=>({...prevState,fileText: "",fileInfo: {},fileStatus:0,precentProgress : 0,displayEstimateSpinners:false}))
               this.clearFile()
             })
            })
           })
          }) 
        }else if(status==="LOADING"){
          this.setState(prevState=>({
            ...prevState,
            fileStatus:1,
            precentProgress:result
          }))
        }
     })
    })
}

  setMaterial = (code) => {
    if(this.state.setMaterial !== code){
      this.setState(prevState=>({
        ...prevState,
        materialCode: code,
        density: densityValue(code)
      }),()=>{
        this.businessInfoUpdater()
      })
    }
  }

  setColor = (color) =>{
    if(this.state.setColor !== color){
      this.setState(prevState=>({
        ...prevState,
        setColor: color
      }))
    }
  }
  
  clearFile = () =>{
    document.getElementById("fileUpload").value = "";
    if(this.state.fileStatus !== 0){
        this.setState(prevState=>({
          ...prevState,
          orderStatus: defaultOrderStatus,
          fileInfo: defaultFileInfo,
          fileText: defaultFileText,
          fileBuffer:null,
          fileStatus: defaultFileStatus,
          precentProgress: defaultPrecentPogress,
          materialCode: defaultMaterialCode,
          materialColor: defaultMaterialColor,
          density: defaultDensity,
          displayEstimate: defaultDisplayEstimate,
          bound: defaultBound,
          costToPrint: defaultCostToPrint,
          businessInfo: defaultBusinessInfo,
          uploadedFileResult: null,
          pleaseLoginWarningWithFileHold:false,
          textCopyReRun:false,
        }))
    }
  }

  homeRun = () =>{
    this.setState(prevState=>({
      ...prevState,
      orderStatus: defaultOrderStatus,
      uploadedFileResult:null,
      fileInfo: defaultFileInfo,
      fileText: defaultFileText,
      fileBuffer:null,
      fileStatus: defaultFileStatus,
      precentProgress: defaultPrecentPogress,
      materialCode: defaultMaterialCode,
      materialColor: defaultMaterialColor,
      density: defaultDensity,
      displayEstimate: defaultDisplayEstimate,
      bound: defaultBound,
      costToPrint: defaultCostToPrint,
      businessInfo: defaultBusinessInfo,
      deliveryDate:0,
      billAmount:0.00,
      paymentId:"", 
      pleaseLoginWarningWithFileHold:false,
      textCopyReRun:false,
      //for tracking file uploading into Storage
      loadingOrder:true,
      fileUploadResponse:"yetToUpload",//yetToUpload,error,failed,uploading,success
      //form validation and form data
      fullName: "",
      fullNameValidator: null,
      phoneNo: "",
      phoneNoValidator: null,
      email: "",
      emailValidator: null,
      street: "",
      streetValidator: null,
      city: "",
      cityValidator: null,
      district: "",
      districtValidator: null,
      pincode: "",
      pincodeValidator: null,
      expressCourier: null,
      uid: ""
    }))
  }

  nextStep = () =>{
    this.setState(prevState=>({
      ...prevState,
      orderStatus: prevState.orderStatus+1
    }),()=>{
      if(this.state.orderStatus===3 && this.state.expressCourier==null){
        this.setState(prevState=>({...prevState,expressCourier:false}))
      }
    })
  }
  prevStep = () =>{
    this.setState(prevState=>({
      ...prevState,
      orderStatus: prevState.orderStatus-1
    }))
  }

  updateName = (name) =>{
    if(name.length>=3){
      this.setState(prevState=>({
       ...prevState,
       fullNameValidator:true,
       fullName: name
      }));
    }else{
      this.setState(prevState=>({
        ...prevState,
        fullNameValidator:false
      }))
    }
  }

  updateNo = (number) =>{
    if(number.length === 10){
      this.setState(prevState=>({
        ...prevState,
        phoneNo: number,
        phoneNoValidator: true
      }))
    }else{
      this.setState(prevState=>({
        ...prevState,
        phoneNoValidator: false
      }))
    }
  }

  updateEmail = (email) =>{
   let match = email.match("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$");
    if(match !== null){
      this.setState(prevState=>({
        ...prevState,
        email: match[0],
        emailValidator: true,
      }))
    }else{
      this.setState(prevState=>({
        ...prevState,
        emailValidator: false,
      }))
    }
  }

  updateStreet = (street) =>{
    if(street.length>=5){
      this.setState(prevState=>({
        ...prevState,
        street: street,
        streetValidator: true,
      }))
    }else{
      this.setState(prevState=>({
        ...prevState,
        streetValidator: false,
      }))
    }
  }
  updateCity = (city) => {
    if(city.length>=2){
      this.setState(prevState=>({
        ...prevState,
        city: city,
        cityValidator: true,
      }))
    }else{
      this.setState(prevState=>({
        ...prevState,
        cityValidator: false,
      }))
    }
  }
  updateDistrict = (district) => {
    if(district.length>=2){
      this.setState(prevState=>({
        ...prevState,
        district: district,
        districtValidator: true,
      }))
    }else{
      this.setState(prevState=>({
        ...prevState,
        districtValidator: false,
      }))
    }
  }
  updatePincode = (pincode) => {
    pincode = parseInt(pincode).toString()//remove zeros at front
    if(pincode.length === 6){
      this.setState(prevState=>({
        ...prevState,
        pincode: pincode,
        pincodeValidator: true,
      }))
    }else{
      this.setState(prevState=>({
        ...prevState,
        pincodeValidator: false,
      }))
    }
  }
  expressRequired = (status) =>{
    if(this.state.expressCourier !== status){
      this.setState(prevState=>({
        ...prevState,
        expressCourier: status
      }),()=>{
        expectedDeliveryDate(new Date(),this.state.expressCourier,(deliveryDate)=>{
          this.setState(prevState=>({
            ...prevState,
            deliveryDate
          }))
        })
        billAmountCalculator(this.state.costToPrint,this.state.expressCourier,(billAmount)=>{
          this.setState(prevState=>({
            ...prevState,
            billAmount
          }))
        })
      })
    }
  }
  mojoCheckout = (finalBillAmount) => {
    authState(user=>{
      if(user){
        Instamojo.configure({
          handlers: {
            onOpen: function() {},
            onClose: function() {},
            onSuccess: (response)=>{
              this.setState(prevState=>({
                ...prevState,
                paymentId:response.paymentId,
                orderStatus: prevState.orderStatus+1
              }),()=>{
                Instamojo.close()
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
            },
            onFailure: (response)=>{
              Instamojo.close()
              ToasterCustomMessage("success","please try again in some time","top-right")
              ToasterCustomMessage("warning","Error in making payment","top-right")
              ToasterCustomMessage("warning","Money will be credited back incase debited","top-right")
            }
        } 
      })
      fetch(INSTAMOJOFUNCTION,{
        method:"POST",
        headers: new Headers(),
        body: JSON.stringify({name:this.state.fullName,email:this.state.email,phone:this.state.phoneNo,amount:finalBillAmount,purpose:this.state.fileInfo.name})
      })
      .then(response=>{  
        return response.json()
      })
      .then(data=>{
        if(data.status==="error"){
          ToasterCustomMessage("muted","please, try after sometime","top-right")
        }else{//Opening Instamojo gateway here
          ToasterCustomMessage("muted","opening securedGateway","top-right")  
          Instamojo.open(data.message)
        }
      })
      .catch(error=>{
        console.log(error)
        ToasterCustomMessage("success","please try again in some time","top-right")
        ToasterCustomMessage("warning","Error in making payment","top-right")
      })
      }else{
        ToasterCustomMessage("muted","login before you pay","top");
      }
    })
  }

  render(){
    return (
      <Context.Provider value={this.state}>
        <Header openWelcomeModal={()=>this.openWelcomeModal()}/>
        {this.state.orderStatus===1?
          <div style={{padding:"10%"}}>
          <Card1 title="Upload your STL file to print" 
            fileInfo={(e)=>this.filePharser(e)}
            clearFile={()=>this.clearFile()}
            setMaterial={(code)=>this.setMaterial(code)}
            setColor={(color)=>this.setColor(color)}
            nextStep={()=>this.nextStep()}
          /></div>:
          this.state.orderStatus===2 ?
          <div style={{padding:"1%"}}>
            <Card2 title="Give your address so we can delivery"
              prevStep={()=>this.prevStep()}
              updateName={(name)=>this.updateName(name)}
              updateNo={(number)=>this.updateNo(number)}
              updateEmail={(email)=>this.updateEmail(email)}
              updateStreet={(street)=>this.updateStreet(street)}
              updateCity={(city)=>this.updateCity(city)}
              updateDistrict={(district)=>this.updateDistrict(district)}
              updatePincode={(pincode)=>this.updatePincode(pincode)}
              expressRequired={(status)=>this.expressRequired(status)}
              nextStep={()=>this.nextStep()}
              /></div>: 
            this.state.orderStatus===3 ? 
            <div style={{padding:"1%"}}>
            <Card3 title="Cart and checkout"
                  expressRequired={(status)=>this.expressRequired(status)}
                  prevStep={()=>this.prevStep()}
                  checkOut={(FinalBillAmount)=>this.mojoCheckout(FinalBillAmount)}
                  costToPrint={this.state.costToPrint}
                  deliveryDate={this.state.deliveryDate}
            /></div>: 
            <div style={{padding:"8%"}}><Card4
            loadingOrder={this.state.loadingOrder}
            fileUploadResponse={this.state.fileUploadResponse}
            homeRun={()=>this.homeRun()}
            /></div>
          }
        <Footer onClick={this.onClicked}/>
        <WelcomeModal 
          welcomeModal={this.state.welcomeModal}
          closeWelcomeModal={()=>this.closeWelcomeModal()}
        />
      </Context.Provider>
  );
  }
}