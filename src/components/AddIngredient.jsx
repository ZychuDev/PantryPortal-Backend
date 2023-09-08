import React from "react";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner } from "react-bootstrap";

import axios from "axios";

import {
    useQuery,
    useMutation,
    useQueryClient
  } from '@tanstack/react-query'
import * as config from "../utils/config"

const AddIngredient = () => {
    const userToken = localStorage.getItem('user-token');
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (payload) => {
          return axios.post(config.APIendpoint + 'api/ingredient', payload, {
            headers: { 
                'Authorization': `Bearer ${userToken}`,
            },
          }).then((response) => {
            queryClient.invalidateQueries('allIngredients');
          })
        },
      })

    const submitIngredient = (event) => {
        event.preventDefault();
        const formElement = document.querySelector('#ingredientForm');
        const formData = new FormData(formElement);
        let payload = {}
        for (var pair of formData.entries()){
            payload[pair[0]] = String(pair[1]);
        }
        mutation.mutate(payload);
    }
    return (
        <Card className="mx-3 text-center bg-info ">
            <Container className="my-5">
                <h2 className="fw-normal mb-5">Add new Ingredient to Database</h2>
                <Row>
                    <Col md={{span: 12}}>
                        <Form id="ingredientForm" onSubmit={submitIngredient} className="text-center">
                            <FormGroup className="mb-3">
                                    <FormLabel htmlFor={'ingredient-name'}>Ingredient Name</FormLabel>
                                    <input type={'text'} className="form-control" id={'ingredient-name'} name="name" required />
                            </FormGroup>
                            <h3 className="fw-normal mb-5">MAKRO for 100g of product</h3>
                            <Row className="mb-3">
                                <FormGroup as={Col}>
                                    <FormLabel htmlFor={'ingredient-kcal'}>Kcal</FormLabel>
                                    <input type={'number'} className="form-control" id={'ingredient-kcal'} name="kcal" required />
                                </FormGroup>
                                <FormGroup as={Col}>
                                    <FormLabel htmlFor={'ingredient-fat'}>Fat</FormLabel>
                                    <input type={'number'} className="form-control" id={'ingredient-kcal'} name="fat" required />
                                </FormGroup>
                                <FormGroup as={Col}>
                                    <FormLabel htmlFor={'ingredient-protein'}>Protein</FormLabel>
                                    <input type={'number'} className="form-control" id={'ingredient-kcal'} name="protein" required />
                                </FormGroup>
                                <FormGroup as={Col}>
                                    <FormLabel htmlFor={'ingredient-carb'}>Carb</FormLabel>
                                    <input type={'number'} className="form-control" id={'ingredient-kcal'} name="carb" required />
                                </FormGroup>
                            </Row>
                            <Button type="submit" className="btn-success mt-2" id="add-ingredient-btn">Add</Button>
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
                                    <div>Ingredient added!</div>
                                ) : null
                        )}
                    </Col>
                </Row>
            </Container>
        </Card>
    );
}

export default AddIngredient