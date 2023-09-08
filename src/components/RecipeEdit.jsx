import React, {useState, useRef} from "react";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useParams} from 'react-router-dom';

import {
    useQuery,
    useMutation,
    useQueryClient
  } from '@tanstack/react-query';
import * as config from "../utils/config";



const RecipeEdit = () => {
    const [selectedIngredient, setSelectedIngredient] = useState("");
    const amountRef = useRef();
    const instructionRef = useRef();
    const queryClient = useQueryClient();
    const params = useParams();
    const name = params.name;
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

    const handleButtonClick = () =>{
        navigate(`../recipes`);
    }

    const handleDeleteIngredient = async (ingredient_name) =>{
        let payload ={"recipe_name":`${name}`,
        "ingredient_name": ingredient_name,
        "weight": 0};

        return await axios.delete(`${config.APIendpoint}api/recipe/ingredients/${name}/${ingredient_name}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
          });
    }

    const handleDeleteRecipe = async (payload) =>{
        return await axios.delete(config.APIendpoint + `api/recipe/${name}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            }
        })
    }

    const handleAddIngredient = async (payload) =>{
        return await axios.post(config.APIendpoint + 'api/recipe/ingredients', payload, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        })
    }

    const handleChangeInstruction = async (payload) =>{
        return await axios.patch(config.APIendpoint + `api/recipe/${name}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
            data:{
                payload: payload
            }
        })
    }

    const recipe = useQuery(['recipe'], fetchRecipe);
    const ingredients = useQuery(['avaliableIngredients'], fetchIngredients);
    const consists = useQuery(['consists'], fetchConsists);

    const deleteIngredientMutation = useMutation({
        mutationFn: handleDeleteIngredient,
        onSuccess: () =>{
            queryClient.invalidateQueries('consists');
        }
    })

    const addIngredientMutation = useMutation({
        mutationFn: handleAddIngredient,
        onSuccess: () =>{
            queryClient.invalidateQueries('consists');
        }
    })

    const changeInstructionMutation = useMutation({
        mutationFn: handleChangeInstruction,
        onSuccess: () =>{
            queryClient.invalidateQueries('recipe');
        }
    })

    const deleteRecipeMutation = useMutation({
        mutationFn: handleDeleteRecipe,
        onSuccess: () =>{
            navigate('../recipes');
        }
    })

    const submitIngredient = (event) => {
        event.preventDefault();

        let payload ={"recipe_name":`${name}`,
        "ingredient_name": selectedIngredient,
        "weight": amountRef.current.value};

        addIngredientMutation.mutate(payload);
    }

    const handleInstructionSubmit = (event) =>{
        event.preventDefault();
        let payload = JSON.stringify({ instruction: instructionRef.current.value });
        changeInstructionMutation.mutate(payload);
        
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

                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{i.name}</td>
                    <td>{i.kcal}</td>
                    <td>{i.fat}</td>
                    <td>{i.protein}</td>
                    <td>{i.carb}</td>
                    <td>{amount}</td>
                    <td><Button className="btn-danger mt-2"  onClick={() => deleteIngredientMutation.mutate(i.name)}>X</Button></td>
                </tr>

        );} 
    );

    return (
        <Card className="mx-3 text-center bg-info ">
            <Container className="my-5">
                <Row>
                    <Col md={10}>
                        <h2 className="fw-normal mb-5">{name}</h2>
                    </Col>
                    <Col md={2}>
                        <Button className="btn-danger mt-2" id="remove-recipe-btn" onClick={() => deleteRecipeMutation.mutate()}>Delete</Button>
                    </Col>
                </Row>
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
                                    <th>DELETE</th>
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
                                    <td>...</td>
                                </tr>
                            </tbody>
                        </Table>

                        <Form id="addIngredientForm" onSubmit={submitIngredient} className="text-center">
                            <Form.Group controlId="ingredientSelect">
                                <Form.Label>Select an Ingredient</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedIngredient}
                                    onChange={(e) => setSelectedIngredient(e.target.value)}
                                >
                                    <option value="">Select an ingredient</option>
                                    {ingredients.data.map((ingredient) => (
                                    <option key={ingredient.id} value={ingredient.name}>
                                        {ingredient.name}
                                    </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Row className="mb-3">
                                <FormGroup as={Col}>
                                    <FormLabel htmlFor={'ingredient-kcal'}>Amount</FormLabel>
                                    <input type={'number'} className="form-control" id={'ingredient-kcal'} name="kcal" required ref={amountRef} />
                                </FormGroup>
                            </Row>
                            <Button type="submit" className="btn-success mt-2" id="add-ingredient-btn">Add</Button>
                        </Form>

                    </Col>

                    <Col md={6}>
                        <h3 className="fw-normal mb-5">Preparation Description</h3>
                        <p class="font-italic">{recipe.data.instruction || "No instruction provided." }</p>

                        <form onSubmit={handleInstructionSubmit}>
                            <input 
                                style={{padding: '10px 0', height: '300px'}}
                                type="text"
                                placeholder="Type new instruction ..."
                                ref = {instructionRef}
                            />
                            <br/>
                            <button type="submit">Update Instruction</button>
                        </form>
                    </Col>


                </Row>
            </Container>
            <Button className="btn-success mt-2" id="add-recipe-btn" onClick={handleButtonClick}>Back</Button>
        </Card>

    );
}

export default RecipeEdit

