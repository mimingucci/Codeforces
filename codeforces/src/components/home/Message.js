import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HandleCookies from "../../utils/HandleCookies";
import MessageApi from "../../getApi/MessageApi";
const Message=()=>{
    const {user}=useParams();
    const [oldmessage, setOldmessage]=useState(null);
    const [message, setMessage]=useState('');
    useEffect(()=>{
       const x=HandleCookies.getCookie('nickname');
       if(x==null || x.length==0){
        window.location.replace('/login');
       }
       MessageApi.getMessage(user, x).then(res=>setOldmessage(res?.data));
    }, [user]);
    const handleType=(e)=>{
        setMessage(e.target.value);
        console.log(message);
    }
    const handleSend=()=>{
        if(message==null || message.length==0){
            alert("Message must not be empty!!!");
            return;
        }
        let child1=document.createElement('div');
        let child2=document.createElement('div');
        child1.style.width="100%";
        child2.style.width="fit-content";
        child2.style.borderRadius="8px";
        child2.style.paddingLeft="8px";
        child2.style.paddingRight="8px";
        child2.style.marginTop="8px";
        child2.style.marginBottom="8px";
        // if(m?.author==user){
        //     child2.style.backgroundColor="#e5e7eb";
        //     child2.style.marginLeft="auto";
        // }else{
        child2.style.backgroundColor="#22c55e";
        // }
        child2.innerHTML=message;
        child1.appendChild(child2);
        document.getElementById("message_box").appendChild(child1);
        MessageApi.createMessage(HandleCookies.getCookie('nickname'), user, message).then().catch(err=>alert("Can not send message"));
    }
    return (
        <div className="px-[150px] mt-[20px]">
            <h1>{user}</h1>
            <div className="h-[300px] overflow-y-scroll" id="message_box">
                {oldmessage && oldmessage?.map(m=><div className="w-full">
                    <div className={m?.author==user ? "w-fit bg-gray-200 rounded-lg text-left px-2 my-2 ml-auto" : "w-fit bg-green-500 rounded-lg text-left px-2 my-2"}>{m?.content}</div>
                </div>)}
            </div>
            <div className="relative">
                <input type="text" className="border-solid rounded-[50px] border-blue-500 border-[2px] w-full" onChange={handleType}/>
                <button onClick={handleSend} className={message.length>0 ? "absolute right-1 top-1 bg-green-400 py-[5px] px-[10px] rounded-[50px]" : "absolute right-1 top-1 bg-gray-300 py-[5px] px-[10px] rounded-[50px] disabled" }>Send</button>
            </div>
        </div>
    )
}
export default Message;