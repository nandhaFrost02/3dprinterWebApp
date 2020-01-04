import React from 'react';
import {Navbar, Nav,Container,Row,Col,Button} from 'react-bootstrap';
import {ContactUsModal,FeedbackModal,ReportMeModal, AboutUsModal,TermsnConditionModal,PrivacyPoliciesModal} from './Modals';
import {TrackOrderModal} from './modals/TrackOrderModal';
import UserAuth from './UserAuth';
import logo28size from './../assets/logo28size.png';

const Header = (props) => (
  <div><img src={logo28size} style={{float:"left",paddingLeft:"16px",paddingRight:"4px",paddingTop:"8px",paddingBottom:"8px"}}alt="logoImg"/>
  <Navbar collapseOnSelect expand="lg" style={{paddingLeft:"0px"}}>  
  <Navbar.Brand>
      <span className="text-muted">3dPrint.Froozen</span>
    </Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto"></Nav>
    <Nav style={{float:"right"}}>
      <Button variant="" onClick={()=>props.openWelcomeModal()}>welcome note</Button>
      <TrackOrderModal/>
      <UserAuth loginText="Login with Gmail" />
    </Nav>
  </Navbar.Collapse>
</Navbar>
</div>
);

const Footer = () => (
    <Navbar sticky="bottom" style={{paddingBottom:"40px"}}className="bg-dark text-white" expand="lg">
    <Row>
      <Col>
        <Container>
          <Col className="text-success"><strong>3dPrint.Froozen</strong></Col>
          <Col><span>Product of <span className="text-success">Froozen</span></span></Col>
          <Col><span>&#9400;All rights reserved,2019</span></Col>
        </Container>
      </Col>
      <Col>
        <Container>
          <Col className="text-success"><strong>LegalInformation</strong></Col>
          <Col><AboutUsModal /></Col>
          <Col><TermsnConditionModal /></Col>
          <Col><PrivacyPoliciesModal /></Col>
        </Container>
      </Col>
      <Col>
        <Container>
        <Col className="text-success"><strong>Talk with us</strong></Col>
          <Col><FeedbackModal/></Col>
          <Col><ContactUsModal/></Col>
          <Col><ReportMeModal /></Col>
        </Container>
      </Col>
      <Col>
        <Container>
          <Col className="text-success"><strong>made in INDIA</strong></Col>
          <Col>Developed and Owned by <strong className="text-success">Mr.NandhaFrost</strong></Col>
        </Container>
      </Col>
      <Col>
        <Container>
          <Col className="text-success"><strong>Froozen Products</strong></Col>
          <Col>3dPrint.Froozen</Col>
          <Col>more on way...</Col>
        </Container>
      </Col>
      <Col>
        <Container>
          <Col className="text-success"><strong>3dPrinter.Froozen</strong></Col>
          <Col><small>{process.env.REACT_APP_STAGE} release</small></Col>
          <Col>Version <strong className="text-success">{process.env.REACT_APP_VERSION}</strong></Col>
        </Container>
      </Col>
    </Row>
  </Navbar>
);
/**
 * 
 *   <Container className="bg-dark text-white">
  
  </Container>
 */
export {
    Header,
    Footer
}