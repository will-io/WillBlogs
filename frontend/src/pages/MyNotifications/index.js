import React, { useState, useEffect } from  'react'
import moment from 'moment'
import api from '../../services/api'
import { Button, ButtonGroup } from 'reactstrap'
import './style.css'

export default function MyNotifications(){
    const [ MyEvents, setMyEvents ] = useState([])
    const user = localStorage.getItem('user')

    useEffect(()=>{
        getMyEvents()
    },[])

    const  getMyEvents = async () => {
        try {
            const response = await api.get('/comment',{headers:{user}})
            setMyEvents(response.data)
        } catch (error) {
            
        }
    }
    

    const isApproved = (approved) => approved === true ? "Approved" : "Rejected"

    const acceptEventHandler = async (eventId) => {
        try {
            await api.post(`/comment/${eventId}/approvals`, {}, { headers: { user } })
            getMyEvents()

        } catch (err) {
            console.log(err)
        }
    }
    // will repurpose the app with a rejection funtion
    return(
        <ul className="events">
            {MyEvents.map(event => (
                <li key={event._id}>
                    <div><strong>{event.eventTitle} </strong></div>
                    <div className="event-details">
                    <span><strong>Date:</strong>{moment(event.EventDate).format("MMM Do YYYY")} </span>
                    <span> <strong>Email:</strong> {event.userEmail} </span>
            
                    <span>Status:
                            <span className={event.approved !== undefined ? isApproved(event.approved) : "Pending"}>{event.approved !== undefined ? isApproved(event.approved) : "Pending"}</span>
                    </span>
                    </div>

                    <ButtonGroup>
                    <Button disabled={event.approved === true || event.approved === false ? true : false} color="secondary" onClick={() => acceptEventHandler(event._id)}>Accept</Button>
                    </ButtonGroup>

                </li>
            ))}
        </ul>
    )
}