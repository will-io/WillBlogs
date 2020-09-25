import axios  from 'axios';  
//try new ip
const api = axios.create({
    baseURL:'http://localhost:8000'
})

export default api;