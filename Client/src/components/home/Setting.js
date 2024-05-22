import { useLocation } from "react-router-dom";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";

const Setting = () => {
  const location=useLocation();
  const handleSubmit=async(e)=>{
     e.preventDefault();
     const firstname=document.getElementById('firstname')?.value;
     const lastname=document.getElementById('lastname')?.value;
     const description=document.getElementById('description')?.value;
     const oldpassword=document.getElementById('oldpassword')?.value;
     const newpassword=document.getElementById('newpassword')?.value;
     if((oldpassword!=null && oldpassword.length>0) || (newpassword!=null && newpassword.length>0)){
        if((oldpassword==null || oldpassword.length==0) || (newpassword==null || newpassword.length==0)){
            alert("Please enter full password");
            return;
        }
        if(HandleCookies.getCookie('password')==oldpassword){
            //
        }else{
            alert("Password isn't correct");
            return;
        }
     }
     try{
        const res=await UserApi.updateUser(location?.pathname.split('/')[2], firstname, lastname, description, newpassword);
        HandleCookies.setCookie('password', res?.data?.password, 30);
        window.location.replace('/'+location?.pathname.split('/')[1]+'/'+location?.pathname.split('/')[2]);
     }catch(err){
        alert("Error occur");
     }
  }  
  return (
    <div className="w-full">
      <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
        <form>
          <h1>Change setting:</h1>
          <div class="field">
            <label for="name">First Name:</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your firstname"
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">Last Name:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your lastname"
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Enter your description"
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">Old Password:</label>
            <input
              type="password"
              id="oldpassword"
              name="oldpassword"
              placeholder="Enter your old password"
            />
            <small></small>
          </div>
          <div class="field">
            <label for="name">New Password:</label>
            <input
              type="password"
              id="newpassword"
              name="newpassword"
              placeholder="Enter your new password"
            />
            <small></small>
          </div>
          <div className="text-center">
            <button type="submit" onClick={handleSubmit} className="bg-blue-600 rounded-sm text-white px-[10px] py-[5px] mt-[20px] mx-auto">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Setting;
