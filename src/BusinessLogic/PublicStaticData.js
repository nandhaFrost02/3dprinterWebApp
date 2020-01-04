const PLA_density = 1.25;//g/cm3
const ABS_density = 1.30;//0.9 to 1.53 g/cm3

const defaultOrderStatus=1;
const defaultPrecentPogress=0;
const defaultResetButton=false;
const defaultFileInfo={};
const defaultFileText="";
const defaultFileStatus=0;
const defaultMaterialCode="PLA";
const defaultMaterialColor="yellow";
const defaultDensity=PLA_density;
const defaultBusinessInfo={};
const defaultDisplayEstimate=false;
const defaultBound={};
const defaultCostToPrint=0;
/*
 * PLA = 1
 * ABS = 2
 */
const densityValue = (code) =>{
    switch(code){
        case "PLA":
        return PLA_density;

        case "ABS":
        return ABS_density;

        default:
        return PLA_density;
    }
}

export {
    densityValue,
    defaultOrderStatus,defaultPrecentPogress,defaultResetButton,defaultFileInfo,defaultFileText,defaultFileStatus,defaultMaterialCode,
    defaultMaterialColor,defaultDensity,defaultBusinessInfo,defaultDisplayEstimate,defaultBound,
    defaultCostToPrint
}