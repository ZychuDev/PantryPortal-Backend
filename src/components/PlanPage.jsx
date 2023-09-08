import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner, Table } from "react-bootstrap";

import Plan from './Plan';

import {
    useQuery,
    useMutation,
    useQueryClient
  } from '@tanstack/react-query';
import * as config from "../utils/config";
import axios from "axios";

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

const PlanPage = () => {
    const [selectedDate, setSelectedDate] = useState(getCurrentDate());
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries('plan');
      }, [selectedDate]);

    const handleDateChange = (e) => {
        queryClient.invalidateQueries('plan');
        setSelectedDate(e.target.value);
        queryClient.invalidateQueries('plan');
      };

    const fetchPlan = async (date) => {
        let d = `${date.queryKey}`
        d.slice(5)
        let a = d.split(",")["1"].toString()
        const response = await axios.get(config.APIendpoint + `api/plan/${a}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    };

    const createPlan = async (payload) => {
        const response = await axios.post(config.APIendpoint + `api/plan`, payload, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    };

    const plan = useQuery(['plan', selectedDate], fetchPlan);
    const createPlanMutation = useMutation({
        mutationFn: createPlan,
        onSuccess: () => {queryClient.invalidateQueries("plan")}
    })

    const handleButtonClick = () =>{
        createPlanMutation.mutate({dateField: selectedDate});
    }
    if(plan.isLoading){
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    return(
        <>
            <div>
                <h2>Pick Date</h2>
                <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                />
                {selectedDate && (
                <p>You selected: {selectedDate}</p>
                )}
            </div>
            {plan.data && plan.data.length != 0 ? <Plan plan={plan.data} refresh={() => {queryClient.invalidateQueries('plan')}}/> : <Button onClick={handleButtonClick} className="btn-success mt-2" id="add-ingredient-btn">Create plan</Button>}
      </>
    ); 
}

export default PlanPage