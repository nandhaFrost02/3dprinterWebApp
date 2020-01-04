import React from 'react';
import froozenLogo from './../assets/froozenLogo.PNG'

const AboutUsDoc=()=>(
<div>
    <h2><strong className="text-success">FroozenSolution</strong></h2>
    <p>A first step towards froozen-families dream</p>
    <p>It was always been a fantasy to start n run a business. And yes, 
    it has been done now. A journey of several dreams and more hopes has just started</p>
    <h2><strong className="text-muted">Success will be upon us</strong></h2>
    <p style={{textAlign:"right"}} className="text-success"><strong>-Nandha A.K.A NandhaFrost</strong></p>
    <p style={{textAlign:"right"}} className="text-success"><strong>CEO, FroozenSolutions</strong></p>
    <img src={froozenLogo} style={{float:"right",width:"15%",height:"15%"}} alt="froozenLogo"/>
</div>
)

export default AboutUsDoc;