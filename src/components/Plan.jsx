import React, {useState, useRef} from "react";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner, Table, Dropdown } from "react-bootstrap";
import RecipeView from "./RecipeView";
import axios from "axios";
import {useParams} from 'react-router-dom';

import {
    useQuery,
    useMutation,
    useQueryClient
  } from '@tanstack/react-query';
import * as config from "../utils/config";

const Plan = ({plan, refresh}) => { 
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleAddRecipe = async (payload) =>{
        return await axios.post(config.APIendpoint + 'api/plan/recipe', payload, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        })
    }

    const handleDeleteRecipe = async (recipe_name) =>{
        return await axios.delete(`${config.APIendpoint}api/plan/recipe/${recipe_name}/${plan.dateField}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
          });
    }

    const fetchNames = async () => {
        const response = await axios.get(config.APIendpoint + 'api/recipe/names', {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    };

    const names = useQuery(['recipesNames'], fetchNames);
    const addRecipeMutation = useMutation({
        mutationFn: handleAddRecipe,
        onSuccess: () =>{}
    })

    const deleteRecipeMutation = useMutation({
        mutationFn: handleDeleteRecipe,
        onSuccess: () =>{ refresh()
            
        }
    })

    if(names.isLoading){
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }
    let tmp = names.data.map((name) => {return (
        <>
            <RecipeView name={name}/>
            <Button className="btn-danger mt-2"  onClick={() => deleteRecipeMutation.mutate(name)}>DELETE</Button>
        </>
    );});

    console.log(names.data)
    return(
        <>
            <Card className="mx-3 text-center bg-secondary ">
                <Row>
                <Col md={10}>
                    <h2>{`${plan.name}'s plan for ${plan.dateField}`}</h2>
                </Col>
                <Col md={2}>
                <Button className="btn-danger mt-2"  onClick={() => deleteIngredientMutation.mutate(i.name)}>X</Button>
                </Col>
                </Row>
                <Container className="my-5">

                {tmp}
                

                </Container>
                <Dropdown className="ml-auto" >
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {selectedOption}
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={false}>
                        {names.data.map((option, index) => (
                            <Dropdown.Item
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                    </Dropdown>
                <Button className="btn-success mt-2" id="add-recipe-btn" onClick={() => {addRecipeMutation.mutate({recipe_name: selectedOption, date:plan.dateField })}}>Add</Button>
            </Card>
        </>
    );

}

export default Plan