import axios from "axios";
const BASE_URL='http://localhost:8080/baomau/post'
const COMMENT_URL='http://localhost:8080/baomau/comment'
class PostApi{
    getAllPosts(){
        return axios.get(BASE_URL+'/all');
    }
    getPostById(id){
        return axios.get(BASE_URL+'/get/'+id);
    }
    createPost(headline, content, author){
       return axios.post(BASE_URL+'/create', {headline, content}, {params: {nickname: author}});
    }
    createComment(postid, nickname, content){
        return axios.post(COMMENT_URL+'/create', {content}, {params: {postid, nickname}});
    }
    updateLike(id, nickname){
        return axios.put(BASE_URL+'/update/agree/'+id, null, {params: {nickname}});
    }
    updateDislike(id, nickname){
        return axios.put(BASE_URL+'/update/disagree/'+id, null, {params: {nickname}});
    }
}
export default new PostApi();