import axios from "axios";
const BASE_URL='http://localhost:8080/baomau/user'
class UserApi{
    getAllUsers(){
        return axios.get(BASE_URL+'/get/all');
    }
    getUserByNickname(nickname){
        return axios.get(BASE_URL+'/get/'+nickname)
    }
    getListUserByRating(page){
        return axios.get(BASE_URL+'/rating/'+page)
    }
    getTopContributors(){
        return axios.get(BASE_URL+'/topcontributors')
    }
    getResultBySearch(keyword){
        return axios.get(BASE_URL+'/search', {params: {query: keyword}})
    }
    updateUser(nickname, firstname, lastname, description, newpassword){
        return axios.put(BASE_URL+'/update/'+nickname, {firstname, lastname, description, password: newpassword})
    }
    login(nickname, password){
        return axios.post(BASE_URL+'/login', null, { 
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            params: {'nickname': nickname, 'password': password}
        })
    }
    signup(email, nickname, password){
        return axios.post(BASE_URL+'/create', {nickname, email, password})
    }
}
export default new UserApi();