import React, {useState, useEffect, useMemo} from 'react'
import api from '../../services/api'
import { Alert, Container, Button, Form, FormGroup, Input, Label, DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown } from 'reactstrap';
import cameraIcon from '../../assets/camera.png'
import "./events.css";

export default function EventsPage({ history }){
    //const user_id = localStorage.getItem('user');
    const [ title , setTitle ] = useState('')
    const [ content , setContent ] = useState('')
    const [ thumbnail , setThumbnail ] = useState('')
    const [ category , setCategory ] = useState('category')
    const [ date , setDate ] = useState('')//auto update
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem('user');
    
    useEffect(() => {
        if (!user) history.push('/login');
    }, [])

    const toggle = () => setOpen(!dropdownOpen);

    const preview = useMemo(()=> {
        return thumbnail ? URL.createObjectURL(thumbnail): null;
    },[thumbnail])
    //console.log(user_id)

    const submitHandler = async (evt) => {
        evt.preventDefault();

        //const user_id = localStorage.getItem('user');
        const eventData = new FormData();

        eventData.append("thumbnail",thumbnail);
        eventData.append("category",category);
        eventData.append("title",title);
        eventData.append("content",content);
        eventData.append("date", date);

        try {
            if (title !== "" &&
                content !== "" &&
                category !== "category" &&
                date !== "" &&
                thumbnail !== null
            ) {
                console.log("Post has been sent")
                await api.post("/event", eventData, { headers: { user } })
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    history.push("/")
                }, 2000)
            } else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2000)

                //console.log("Missing required data")
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error);
        }
        
    }

    const categoryEventHandler = (category) => setCategory(category);

    return(
        <Container>
            <h2> Create your post</h2>
            <Form onSubmit = {submitHandler}>
                <FormGroup>
                    <Label >Upload Image:</Label>
                    <Label id="thumbnail" style={{backgroundImage: `url(${preview})`}} className={thumbnail? 'has-thumbnail': ''}>
                        <Input  type="file" onChange ={(evt) => setThumbnail(evt.target.files[0])}/>
                        <img src={cameraIcon} style={{maxWidth: "50px"}} alt="upload icon image"/>
                    </Label>
                </FormGroup>

                <FormGroup>
                    <Label>Title:</Label>
                    <Input id="title" type="text" value={title} placeholder={'Event Title'} onChange ={(evt) => setTitle(evt.target.value)}/>
                </FormGroup>

                <FormGroup>
                    <Label>Content:</Label>
                    <Input id="content" type="textarea" value={content} placeholder={'Event Details'} onChange ={(evt) => setContent(evt.target.value)}/>
                </FormGroup>


                <FormGroup>
                    <Label>Event date: </Label>
                    <Input id="date" type="date" value={date} placeholder={'post Date'} onChange={(evt) => setDate(evt.target.value)} />
                </FormGroup>

                <FormGroup>
                    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                        <Button id="caret" value={category} disabled>{category} </Button>
                        <DropdownToggle caret />
                        <DropdownMenu>
                            <DropdownItem onClick={() => categoryEventHandler('tech')}>tech</DropdownItem>
                            <DropdownItem onClick={() => categoryEventHandler('movies')}>movies</DropdownItem>
                            <DropdownItem onClick={() => categoryEventHandler('music')}>music</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </FormGroup>

                <FormGroup style={{textAlign:'center'}}>
                <Button className="submit-btn">
                    Post Event!
                </Button>
                </FormGroup>

                <FormGroup style={{textAlign:'center'}}>
                <Button className="secondary-btn" onClick={() => history.push("/")}>
                        Cancel
                </Button>
                </FormGroup>
            </Form>

            {error ? (
                <Alert className="event-validation" color="danger"> Missing required information</Alert>
            ) : ""}
             {success ? (
                <Alert className="event-validation" color="success"> The post was created successfully!</Alert>
            ) : ""}
        </Container>
    )

}