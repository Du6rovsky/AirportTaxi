import axios from 'axios';
import {CONFIG} from '@/config/config';

const http = axios.create({
    baseURL: CONFIG.api,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default http;
