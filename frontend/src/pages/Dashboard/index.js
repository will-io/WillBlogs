import React, { useState, useEffect, useMemo} from 'react';
import api from '../../services/api';
import moment from 'moment';
import { Button, Alert, UncontrolledCollapse, CardBody, Card, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ButtonGroup  } from 'reactstrap';
import './dashboard.css'
import socketio from 'socket.io-client';
//shows all post
export default function Dashboard({history}){
    const  [events, setEvents ] = useState([]);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');
    //const  [event, setEvent ] = useState([]);//might be wrong
    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messageHandler, setMessageHandler] = useState('');
    const [eventsRequest, setEventsRequest] = useState([]);
    const [ dropdownOpen, setDropDownOpen ] = useState(false);
    const [eventRequestMessage, setEventRequestMessage] = useState('')
    const [eventRequestSuccess, setEventRequestSuccess] = useState(false)
    

    const toggle = () => setDropDownOpen(!dropdownOpen)
    //added for modal
    //const [modal, setModal] = useState(false);
 
    useEffect(()=> {
        getEvents()
    },[])

    const socket = useMemo(
        ()=>
            socketio('http://localhost:8000/', { query: { user: user_id } }),
        [user_id]
    );

    useEffect(()=> {
        socket.on('comment_request', data => setEventsRequest([ ...eventsRequest, data]));
    },[eventsRequest, socket])

    const filterHandler = (query) => {
        setRSelected(query);
        getEvents(query)
    }

    const myEventsHandler = async () =>{
        try {
            setRSelected('myevents')
            const response = await api.get('/user/events', { headers: { user: user } })
            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');
        }
    }

    const getEvents = async (filter) => { 
        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard';
            const response = await api.get(url, { headers: { user: user } })

            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');
        }

    };
    
    const deleteEventHandler = async(eventId) => {
        
        try {
            await api.delete(`/event/${eventId}`, { headers: { user: user } });
            setSuccess(true)
            setMessageHandler('The post was deleted successfully!')
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)
            
        } catch (error) {
            setError(true)
            setMessageHandler('Error when deleting post!')
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    };

    const commentRequestHandler = async (event) =>{
        try {
            await api.post(`/comment/${event.id}`, /*perhaps commentary*/ {}, { headers: { user } })

            setSuccess(true)
            setMessageHandler(`The feedback for the post ${event.title} was successfully sent!`)
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)

        } catch (error) {
            setError(true)
            setMessageHandler(`The feedback for the post ${event.title} wasn't successfully sent!`)
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

   const acceptHandler = async (eventId) => {
       try {
           await api.post(`/comment/${eventId}/approvals`,{}, { headers: {user} })
           setEventRequestSuccess(true)
           setEventRequestMessage('feedback succesful')
           removeNotificationFromDashboard(eventId)
           setTimeout (() => {
                setEventRequestSuccess(false)
                setEventRequestMessage('')
           },2000)
       } catch (err) {
        console.log(err)
       }
   }

    const removeNotificationFromDashboard = (eventId) => {
        const newEvents = eventsRequest.filter((event) => event._id !== eventId)
        setEventsRequest(newEvents)
    }

    return(
        <>
            <ul className="notifications">
                {eventsRequest.map(request =>{
                    return(
                        <li key={request._id}>
                            <div>
                                <strong>{request.user.firstName} at {request.user.email}</strong> liked your post:
                                <strong> {request.event.title}</strong>
                            </div>
                            <ButtonGroup>
                                <Button color="secondary" onClick={()=> acceptHandler(request._id)}>Sweet, Thank!</Button>
                            </ButtonGroup>
                        </li>
                    )
                })}
            </ul>
            {eventRequestSuccess ? <Alert color="success"> {eventRequestMessage}</Alert> : ""}
            <div className="filter-panel" >
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle color ="primary" caret>
                        Filter By
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null}> All Posts</DropdownItem>
                        <DropdownItem onClick={myEventsHandler} active={rSelected === 'myevents'}> My Blogs </DropdownItem>
                        <DropdownItem onClick={() => filterHandler("tech")} active={rSelected === 'tech'}> Tech </DropdownItem>
                        <DropdownItem onClick={() => filterHandler("movies")} active={rSelected === 'movies'}> Movies </DropdownItem>
                        <DropdownItem onClick={() => filterHandler("music")} active={rSelected === 'music'}> Music </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <ul className= "blog-list">
                {events.map(event => (
                    <li key={event._id}>
                        <header style={{backgroundImage: `url(${event.thumbnail_url})`}} >
                        {event.user === user_id ? <div><Button color="danger" size="sm"onClick={() => deleteEventHandler(event._id)}>Delete</Button></div>  : ""}
                        </header>

                        <strong  >{event.title}</strong>
                        <span> {event.content}</span>
                        <span>{moment(event.date).format("MMM Do YYYY")}</span>
                        <span>#{event.category}</span>
                        <Button color="primary" onClick={() => commentRequestHandler(event)}>Liked this read? Let me know! 👍 </Button>
                    </li>
                ))}
            </ul>

        
            {error ? (
                <Alert className="event-validation" color="danger"> {messageHandler} </Alert>
            ) : ""}
            {success ? (
                <Alert className="event-validation" color="success"> {messageHandler} </Alert>
            ) : ""}
        </>
    )
}

