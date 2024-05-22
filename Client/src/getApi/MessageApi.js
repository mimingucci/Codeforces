import axios from "axios";
const BASE_URL='http://localhost:8080/baomau/message';
class MessageApi{
    getMessage(author, recipient){
        return axios.get(BASE_URL+'/oldmessages', {params: {author, recipient}});
    }
    createMessage(author, recipient, content){
        return axios.post(BASE_URL+'/create', {author, recipient, content});
    }
}
export default new MessageApi();