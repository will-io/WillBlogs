import React from 'react';
import { Container, Badge } from 'reactstrap'
import './App.css';
import Routes from './routes'


function App() {
  return (
    <Container>
    <Badge color="info"> <h1>Will Blogs </h1></Badge> 
      <div className="content" >
        <Routes/>
      </div>
    </Container>
  );
}

export default App;
