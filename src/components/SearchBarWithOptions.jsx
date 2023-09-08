import React, { useState } from 'react';
import { Form, FormControl, Dropdown, Col, Container, Row, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import RecipeView from './RecipeView';

const SearchBarWithOptions = ({ options }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

    // Filter options based on the search term
    const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(newSearchTerm.toLowerCase())
    );
        setFilteredOptions(filtered);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setSearchTerm(option.label); 
        setFilteredOptions([]);
    };


    const clearSelectedOption = () => {
        setSelectedOption(null);
        setSearchTerm('');
        setFilteredOptions([]);
    };

    return (
    <Container className="my-5">
        <Row>
            <Col md={{span: 9}}>
                <Form className="d-flex align-items-center">
                    <FormControl
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    />
                </Form>
            </Col>
            <Col md={{span: 3}}>
                {filteredOptions.length === 0 && searchTerm !== '' && (
                    <div className="text-danger text-center">No more matching recipes found.</div>
                )}
                {filteredOptions.length > 0 && (
                    <Dropdown className="ml-auto" >
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Recipes
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={false}>
                        {filteredOptions.map((option) => (
                        <Dropdown.Item
                            key={option.id}
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option.label}
                        </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                    </Dropdown>
                )}
            </Col>
        </Row>
        {selectedOption && (
            <>
                <Dropdown >
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Selected: {selectedOption.label}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={clearSelectedOption}>
                        Clear Selection
                    </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <RecipeView name = {selectedOption.label}/>
            </>
        )}
        </Container>

    );
};

export default SearchBarWithOptions;
