import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-app-burger-f2daf.firebaseio.com/'
})

export default instance;