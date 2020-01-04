import React from 'react';
import toaster from 'toasted-notes';

const ToasterCustomMessage=(color,message,position,secToDisplay) => {
      toaster.notify(<div className={"text-"+color}><strong>{message}</strong></div>,{
        position: position,
        duration: secToDisplay
      })
}
const ToasterErrorMessage=()=>{
  toaster.notify(<div className={"text-danger"}><strong>Something not right, please try again</strong></div>,{
    position: "bottom",
    duration: 2000
  })
}

const ToasterSuccessMessage=(message)=>{
  toaster.notify(<div className={"text-success"}><strong>{message}</strong></div>,{
    position: "bottom",
    duration: 2000
  })
}
export {
  ToasterCustomMessage,
  ToasterErrorMessage,
  ToasterSuccessMessage
}