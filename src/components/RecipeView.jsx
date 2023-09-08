import React from "react";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    useQuery,
    useMutation,
  } from '@tanstack/react-query';
import * as config from "../utils/config";



const RecipeView = ({name}) => {
    const navigate = useNavigate();
    const fetchRecipe= async () => {
        const response = await axios.get(config.APIendpoint + `api/recipe/${name}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    };
    const fetchIngredients = async () => {
        const response = await axios.get(config.APIendpoint + 'api/ingredient', {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    };

    const fetchConsists = async() =>{
        const response = await axios.get(config.APIendpoint + `api/recipe/ingredients/${name}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    }

    const recipe = useQuery(['recipe'], fetchRecipe);
    const ingredients = useQuery(['avaliableIngredients'], fetchIngredients);
    const consists = useQuery(['consists'], fetchConsists);


    const handleButtonClick = () =>{
        console.log(rows);
        navigate(`./${name}`);

    }

    if (recipe.isLoading || ingredients.isLoading || consists.isLoading){
        return (
            <Card className="bg-dark">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Card>
        );
    }

    if (recipe.isError || ingredients.isError|| consists.isError){
        return (
            <Card className="bg-warning">
                <div className="text-primary">An error</div>
            </Card>
        );
    }
    let summary = {kcal:0, fat:0, protein:0,carb:0, weight:0}
    let rows = ingredients.data.filter(ingredient =>
        consists.data.some(item => item.name === ingredient.name)
    ).map((i, index) =>{
        let amount = consists.data.find((c) => c.name == i.name).weight;
        summary.kcal += i.kcal * amount/100;
        summary.fat += i.fat * amount/100;
        summary.protein += i.protein * amount/100;
        summary.carb += i.carb * amount/100;
        summary.weight += amount;
        return(
            <>
                <tr>
                    <td>{index + 1}</td>
                    <td>{i.name}</td>
                    <td>{i.kcal}</td>
                    <td>{i.fat}</td>
                    <td>{i.protein}</td>
                    <td>{i.carb}</td>
                    <td>{amount}</td>
                </tr>
            </>
        );} 
    );

    return (
        <Card className="mx-3 text-center bg-info ">
            <Container className="my-5">
                <h2 className="fw-normal mb-5">{name}</h2>
                <Row>
                    <Col md={6}>
                        <h3 className="fw-normal mb-5">Ingredients</h3>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Kcal</th>
                                <th>Fat</th>
                                <th>Protein</th>
                                <th>Carb</th>
                                <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                { rows }
                                <tr>
                                    <td></td>
                                    <td>Summary</td>
                                    <td>{summary.kcal}</td>
                                    <td>{summary.fat}</td>
                                    <td>{summary.protein}</td>
                                    <td>{summary.carb}</td>
                                    <td>{summary.weight}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>

                    <Col md={6}>
                        <h3 className="fw-normal mb-5">Preparation Description</h3>
                        <p class="font-italic">{recipe.data.instruction || "No instruction provided." }</p>
                    </Col>
                </Row>
            </Container>
            <Button className="btn-success mt-2" id="add-recipe-btn" onClick={handleButtonClick}>Edit</Button>
        </Card>

    );
}

export default RecipeView


