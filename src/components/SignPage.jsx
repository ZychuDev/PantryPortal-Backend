import React from "react";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row } from "react-bootstrap";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as config from "../utils/config"

const SignPage = () => {
    const signAPI = config.APIendpoint + "api/user";
    const navigate = useNavigate();

    const submitSignForm = (event) => {
        event.preventDefault();
        const formElement = document.querySelector('#signForm');
        const formData = new FormData(formElement);
        const formDataJSON = Object.fromEntries(formData);
        const btnPointer = document.querySelector('#sign-btn');
        btnPointer.innerHTML = 'Please wait..';
        btnPointer.setAttribute('disabled', true);
        axios.post(signAPI, {"name": formDataJSON.name, "password":formDataJSON.password}, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
            },

        }).then((response) => {
            console.log(response)
            btnPointer.innerHTML = 'Sign';
            btnPointer.removeAttribute('disabled');
            if (response.status != 201) {
                alert('Unable to sign. Try diffrent username.');
                return;
            }
            setTimeout(() => {
                navigate('/login');
            }, 500);
    }).catch((error) => {
            btnPointer.innerHTML = 'Sign';
            btnPointer.removeAttribute('disabled');
            alert("Oops! Some error occured.");
        });
    }

    return (
        <React.Fragment>
            <Container className="my-5">
                <h2 className="fw-normal mb-5">Sign To Pantry Portal</h2>
                <Row>
                    <Col md={{span: 6}}>
                        <Form id="signForm" onSubmit={submitSignForm}>
                            <FormGroup className="mb-3">
                                <FormLabel htmlFor={'sign-username'}>Username</FormLabel>
                                <input type={'text'} className="form-control" id={'sign-username'} name="name" required />
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <FormLabel htmlFor={'sign-password'}>Password</FormLabel>
                                <input type={'password'} className="form-control" id={'sign-password'} name="password" required />
                            </FormGroup>
                            <Button type="submit" className="btn-success mt-2" id="sign-btn">Sign</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
}

export default SignPage