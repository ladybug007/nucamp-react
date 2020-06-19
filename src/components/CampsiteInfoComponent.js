import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody, ModalHeader, Col, Row, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || val.length <= len;
const minLength = len => val => val && val.length >= len;

function RenderCampsite({ campsite }) {
    return (
        <div className='col-md-5 m-1'>
            <FadeTransform
              in  
              transformProps = {{
                  exitTransform: 'scale(0.5) translateY(-50%)'
              }}>
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardTitle>{campsite.name}</CardTitle>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({ comments, postComment,campsiteId  }) {
    if ({ comments }) {
        return (
            
                <div className='col-md-5 m-1'>
                    <h4>Comments</h4>
                    <Stagger in>
                    {comments.map(comment => {
                        return(
                            <Fade in key={comment.id}>
                                <div>
                                    <p>{comment.text}<br />
                        -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                        </p>
                        </div>
                        </Fade>);
                        })}
                    
                
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment}/>
            </div>


        );
    }
    return (<div></div>);
}
function CampsiteInfo(props) {

    if(props.isLoading){
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <Loading/>
                    </div>
                </div>
            </div>
        );
    }

    if(props.errMess){
        return(
            <div className='container'>
            <div className='row'>
                <div className='col'>
                   <h4>{props.errMess}</h4>
                </div>
            </div>
        </div>  
        )
    }

    if (props.campsite) {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/directory'>Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </div>
                <div className='row'>
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments comments={props.comments} postComment={props.postComment} campsiteId={props.campsite.id}/>
                </div>
            </div>
        );
    }

    return (
        <div>

        </div>
    );

}


class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = { isNavOpen: false };
        this.state = { isModalOpen: false };
    }

    toggleNav() {
        this.setState({ isNavOpen: !this.state.isNavOpen });
    }
    toggleModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }
    handleSubmit(values) {
        /*console.log('Current state is' + JSON.stringify(value));
        alert('Current state is ' + JSON.stringify(value));*/
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);

    }

    render() {


        return (
            <React.Fragment>

                <Button style={{ margin: '50px' }} outline onClick={this.toggleModal}><i className='fa fa-pencil'>Add Comment</i></Button>
                <Modal className='ml-auto' isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={value => this.handleSubmit(value)}>
                            <Row className='form-group'>
                                <Label htmlFor="firstName" md={10}>Rating</Label>
                                <Col md={10}>
                                    <Control.select model='.rating' id="firstName" name="firstName"
                                        placeholder="First Name" className='form-control'>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>

                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Label htmlFor="yourName" md={10}>Your Name</Label>
                                <Col md={10}>
                                    <Control.text model='.author' id="yourName" name="yourName"
                                        placeholder="Your Name" className='form-control' validators={{
                                            required,
                                            maxLength: maxLength(15),
                                            minLength: minLength(2),

                                        }} />

                                    <Errors
                                        model='.author'
                                        className='text-danger'
                                        show='touched'
                                        component='div'
                                        messages={{
                                            required: 'Required',
                                            maxLength: 'Must be 15 characters or less',
                                            minLength: 'Must be atleast 2 characters'
                                        }} />
                                </Col>
                            </Row>

                            <Row className='form-group'>
                                <Label htmlFor="feedback" md={10}>Comments</Label>
                                <Col md={10}>
                                    <Control.textarea model='.text' id="feedback" name="feedback"
                                        rows="5" className='form-control' />
                                </Col>
                            </Row>

                            <Button type='submit' value='submit' color='primary'>Submit</Button>
                        </LocalForm>

                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }

}



export default CampsiteInfo;