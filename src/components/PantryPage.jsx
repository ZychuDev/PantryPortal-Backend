import AddIngredient from './AddIngredient';
import AddRecipe from './AddRecipe';
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner, Table } from "react-bootstrap";
import {
    useQuery,
    useMutation,
    useQueryClient
  } from '@tanstack/react-query';

import axios from "axios";
import * as config from "../utils/config";

const PantryPage = () => {
    const queryClient = useQueryClient();
    const fetchIngredients = async () => {
        const response = await axios.get(config.APIendpoint + 'api/ingredient', {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    };

    const handleDeleteIngredient = async (id) =>{
        return await axios.delete(`${config.APIendpoint}api/ingredient/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
    }

    const ingredients = useQuery(['allIngredients'], fetchIngredients);
    const deleteIngredientMutation = useMutation({
        mutationFn: handleDeleteIngredient,
        onSuccess: () =>{
            queryClient.invalidateQueries('allIngredients');
        }
    })

    if (ingredients.isLoading){
        return <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
    }
    let rows = ingredients.data.map((i, index) =>{
        return(

                <tr key={index}>
                    <td>{i.id}</td>
                    <td>{i.name}</td>
                    <td><Button className="btn-danger mt-2"  onClick={() => deleteIngredientMutation.mutate(i.id)}>X</Button></td>
                </tr>

        );} 
    );

    return (
        <>
            <h1 className='text-center'>Pantry Page</h1>
            <AddIngredient/>
            <AddRecipe/>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    { rows }
                </tbody>
            </Table>

        </>
    );
}

export default PantryPage