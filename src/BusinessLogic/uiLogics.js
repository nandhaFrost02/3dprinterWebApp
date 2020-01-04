let modalUpdator=function(modalStates,modalId,callback){
    let tempModalStates = {}
    Object.keys(modalStates).map((element)=>{
        if(element===modalId){
          tempModalStates[element]=!modalStates[element]
        }else{
          tempModalStates[element] = modalStates[element]
        } 
    })
    callback(tempModalStates)
}


export {modalUpdator}