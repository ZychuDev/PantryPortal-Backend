import extractClaims from "../utils/extractclaims";
import React, { useState } from 'react';
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Card, Spinner, Table } from "react-bootstrap";

import {
    useQuery,
    useMutation,
    useQueryClient
  } from '@tanstack/react-query';

import axios from "axios";
import * as config from "../utils/config";

import Plot from 'react-plotly.js';
import Select from 'react-select';

const options = [
    { value: 'weight', label: 'Weight' },
    { value: 'waist', label: 'Waist' },
    { value: 'hips', label: 'Hips' },
    { value: 'thighs', label: 'Thighs' },
  ];

  const customMeasurementComparator = (m1, m2) => {
    // Convert the date strings to Date objects for comparison
    const date1 = new Date(m1.dateField);
    const date2 = new Date(m2.dateField);
  
    // Compare the Date objects
    if (date1 < date2) {
      return -1; // dateString1 comes before dateString2
    } else if (date1 > date2) {
      return 1; // dateString1 comes after dateString2
    } else {
      return 0; // dateString1 and dateString2 are equal
    }
  };
const HomePage = () => {
    const claims = extractClaims();
    const [selectedDataSet, setSelectedDataSet] = useState(options[0].value);

    const queryClient = useQueryClient();
    const fetchMeasurements = async () => {
        const response = await axios.get(config.APIendpoint + 'api/measurement', {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        });
        return response.data;
    };

    const handleAddMeasurement = async (payload) =>{
        return await axios.post(config.APIendpoint + 'api/measurement', payload, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('user-token')}`,
            },
        })
    }

    const measurements = useQuery(['measurements'], fetchMeasurements);

    const addMeasurementMutation = useMutation({
        mutationFn: handleAddMeasurement,
        onSuccess: () =>{
            queryClient.invalidateQueries('measurements');
        }
    })

    const handleChange = (selectedOption) => {
        setSelectedDataSet(selectedOption.value);
      };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const payload = {
            name: claims['sub'],
            weight: e.target.weight.value,
            waist: e.target.waist.value,
            hips: e.target.hips.value,
            thighs: e.target.thighs.value,
            dateField: e.target.dateField.value,
        };
    
        addMeasurementMutation.mutate(payload);
        // e.target.reset();
      };

    if(measurements.isLoading){
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    measurements.data.sort(customMeasurementComparator);

    return <>
        <h1>{`${claims['sub']} profile.`}</h1>;
        {measurements.data.length < 2 ? <h2 className="text-warning">Add more measurements to see chart.</h2>:
        <div>
            <Select options={options} onChange={handleChange} value={options.find((o) => o.value === selectedDataSet)} />
            <Plot
            data={[
                {
                x: measurements.data.map(i => i.dateField),
                y: measurements.data.map(i => i[selectedDataSet]),
                type: 'line',
                mode: 'lines+markers',

                name: selectedDataSet,
                },
            ]}
            layout={{ title: `Progress chart: ${selectedDataSet}`, xaxis: {
                title: 'Date', // X-axis title
                type: 'date', // Specify that the x-axis contains date values
                tickformat: '%Y-%m-%d', // Date format (e.g., YYYY-MM-DD)
              },
              yaxis: {
                title: 'Value', // Y-axis title
              }, }}
            />
        </div>
        }
        <Card className="mx-3 text-center bg-info ">
        <h2>Add Measurement</h2>
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label htmlFor="weight">Weight:</label>
                <input
                type="number"
                className="form-control"
                id="weight"
                name="weight"
                />
            </div>

            <div className="form-group">
                <label htmlFor="waist">Waist:</label>
                <input
                type="number"
                className="form-control"
                id="waist"
                name="waist"
                />
            </div>

            <div className="form-group">
                <label htmlFor="hips">Hips:</label>
                <input
                type="number"
                className="form-control"
                id="hips"
                name="hips"
                />
            </div>

            <div className="form-group">
                <label htmlFor="thighs">Thighs:</label>
                <input
                type="number"
                className="form-control"
                id="thighs"
                name="thighs"
                />
            </div>

            <div className="form-group">
                <label htmlFor="dateField">Date:</label>
                <input
                type="date"
                className="form-control"
                id="dateField"
                name="dateField"
                />
            </div>

            <button type="submit" className="btn btn-primary">
                Submit
            </button>
        </form>
        </Card>
    </>
}

export default HomePage