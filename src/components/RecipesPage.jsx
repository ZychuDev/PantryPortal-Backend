
import {useParams} from 'react-router-dom';
import { Spinner } from "react-bootstrap";

import axios from "axios";

import SearchBarWithOptions from './SearchBarWithOptions';
import RecipeView from './RecipeView';

import {
    useQuery,
  } from '@tanstack/react-query';
import * as config from "../utils/config";

const fetchNames = async () => {
    const response = await axios.get(config.APIendpoint + 'api/recipe/names', {
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
        },
    });
    console.log(response);
    return response.data;
};

const RecipesPage = () => {
    const {name:recipeName} = useParams();
    const names = useQuery(['recipesNames'], fetchNames);
    if(names.isLoading){
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    if (recipeName === undefined && names.isSuccess){
        console.log(names);
        let options = []
        names.data.forEach((item, index) => {
            options.push({id: index, label: item});
        })
        return <SearchBarWithOptions options={options}/>
    }

    return <RecipeView name={recipeName}/>;
}

export default RecipesPage



