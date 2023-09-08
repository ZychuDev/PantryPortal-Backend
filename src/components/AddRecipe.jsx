import React, {useState, useEffect} from "react";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
    useMutation,
  } from '@tanstack/react-query';
import * as config from "../utils/config";


const AddRecipe = () => {
    const [payload, setPayload] = useState({});
    const navigate = useNavigate();
    const userToken = localStorage.getItem('user-token');

    const mutation = useMutation({
        mutationFn: (payload) => {
          return axios.post(config.APIendpoint + 'api/recipe', payload, {
            headers: { 
                'Authorization': `Bearer ${userToken}`,
            },
          }).then((response) => {
            console.log(response);
          })
        },
        onSuccess: () => {
            navigate(`../recipes/${payload.name}`);
        },
      })

    useEffect(() => {
        const delay = 1000;
        console.log(payload.name);
        if (payload.name != null){
            const timerId = setTimeout(() => mutation.mutate(payload), delay);
            return () => clearTimeout(timerId);
        }
    }, [payload])

    const submitRecipe = (event) => {
        event.preventDefault();
        const formElement = document.querySelector('#recipeForm');
        const formData = new FormData(formElement);
        let tmp = {}
        for (var pair of formData.entries()){
            tmp[pair[0]] = String(pair[1]);
        }
        tmp.instruction = "No instruction provided."
        console.log(tmp)
        setPayload(tmp);
    }


    return (
        <Card className="mx-3 text-center bg-dark text-light ">
            <Container className="my-5">
                <h2 className="fw-normal mb-5">Add new Recipe to Database</h2>
                <Row>
                    <Col md={{span: 12}}>
                        <Form id="recipeForm" onSubmit={submitRecipe} className="text-center">
                            <FormGroup className="mb-3">
                                    <FormLabel htmlFor={'recipe-name'}>Recipe Name</FormLabel>
                                    <input type={'text'} className="form-control" id={'recipe-name'} name="name" required />
                            </FormGroup>
                            <Row className="mb-3">

                            </Row>
                            <Button type="submit" className="btn-success mt-2" id="add-recipe-btn">Add</Button>
                        </Form>
                        {mutation.isLoading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            mutation.isError ? (
                                <div>An error occurred: {mutation.error.message}</div>
                            ) : 
                                mutation.isSuccess ? (
                                    <div>Recipe added!</div>
                                ) : null
                        )}
                    </Col>
                </Row>
            </Container>
        </Card>
    );
}

export default AddRecipe