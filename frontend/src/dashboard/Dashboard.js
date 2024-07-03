import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Form, Button, Table, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { HiOutlineSortDescending } from "react-icons/hi";
import './Dashboard.css';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/scrape', { url });
      setCompanies([...companies, response.data]);
      setUrl('');
    } catch (error) {
      console.error('Error scraping website', error);
    }
  };

  const handleCheckboxChange = (index) => {
    if (selectedCompanies.includes(index)) {
      setSelectedCompanies(selectedCompanies.filter(i => i !== index));
    } else {
      setSelectedCompanies([...selectedCompanies, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(companies.map((_, index) => index));
    }
  };

  const handleDelete = () => {
    setCompanies(companies.filter((_, index) => !selectedCompanies.includes(index)));
    setSelectedCompanies([]);
  };

  const downloadCSV = () => {
    const csvHeader = "Name,Description,Logo,Facebook,LinkedIn,Twitter,Instagram,Address,Phone,Email\n";
    const csvRows = companies.map(company =>
      `${company.name},${company.description},${company.logo},${company.facebook},${company.linkedin},${company.twitter},${company.instagram},${company.address},${company.phone},${company.email}`
    ).join('\n');

    const csvData = csvHeader + csvRows;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'companies.csv');
  };

  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={
            <>
              <div className="form-container">
                <Row className="align-items-center">
                  <Col md={8}>
                    <Form onSubmit={handleSubmit} className="d-flex">
                      <Form.Control
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter Domain Name"
                        className="input-url"
                        required
                      />
                      <Button type="submit" className="save-button">Fetch & Save Details</Button>
                    </Form>
                  </Col>
                </Row>
              </div>

              <div className="table-container mt-4">
                <Row>
                  <Col className="row-1">
                    <span>{selectedCompanies.length} selected</span>
                    <Button variant="danger" onClick={handleDelete} disabled={selectedCompanies.length === 0} className="buttons ml-3">
                      Delete
                    </Button>
                    <Button variant="success" onClick={downloadCSV} className="buttons ml-3">
                      <HiOutlineSortDescending /> Export as CSV
                    </Button>
                  </Col>
                </Row>

                <Table striped bordered hover className="data-table">
                  <thead>
                    <tr className='heading'>
                      <th>
                        <Form.Check
                          type="checkbox"
                          checked={selectedCompanies.length === companies.length && companies.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th> </th>
                      <th>Company</th>
                      <th>Social Profiles</th>
                      <th>Description</th>
                      <th>Address</th>
                      <th>Phone No.</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedCompanies.includes(index)}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </td>
                        <td>
                          <img src={company.logo} className='logo' alt="Logo" width="30"/>
                        </td>
                        <td className='comapany'>
                          <Link>{company.name}</Link>
                        </td>
                        <td className='socials'>
                          <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="ml-2"><FaFacebook /></a>
                          <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="ml-2"><FaLinkedin /></a>
                          <a href={company.twitter} target="_blank" rel="noopener noreferrer" className="ml-2"><FaTwitter /></a>
                        </td>
                        <td>{company.description.split(' ').slice(0, 40).join(' ')}...</td>
                        <td>{company.address}</td>
                        <td>{company.phone}</td>
                        <td>contact@{company.name.toLowerCase().replace(/\s+/g, '')}.com</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          } />
        </Routes>
      </Container>
    </Router>
  );
};

export default Dashboard;
