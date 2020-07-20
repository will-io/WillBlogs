import React from 'react';
import { Container, Badge} from 'reactstrap'
import './App.css';
import Routes from './routes'
import  {ContextWrapper } from './user-context'


function App() {
  return (
    <ContextWrapper>
    <Container>
    <Badge color="info"> <h1>Will Blogs </h1></Badge> 
      <div className="content" >
        <Routes/>
      </div>
    </Container>
    </ContextWrapper>
  );
}

export default App;
