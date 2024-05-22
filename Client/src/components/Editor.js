import React, { useRef, useState } from "react";

import { Grammarly, GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import "../assets/css/style.css";
import { Editor } from "@tinymce/tinymce-react";
import { demoClientId, demoContent, demoHeadline } from "./demo";
import PostApi from "../getApi/PostApi";
import HandleCookies from "../utils/HandleCookies";

const Editors = () => {
    const [content, setContent]=useState('Content')
    const [headline, setHeadline]=useState('Headline')
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const author=HandleCookies.getCookie('nickname');
        try{
           const res=await PostApi.createPost(headline, content, author);
           alert("Your post created success");
        }catch(err){
           alert("Oww! Something wrong");
        }
    }  
    const handleChangeHeadline=(e)=>{
        setHeadline(e.target.getContent());
    }
    const handleChangeContent=(e)=>{
        setContent(e.target.getContent());
    }
  return (
    <div className="pt-[15px]">
    <form>
    <Grammarly
      clientId={demoClientId}
      config={{
        documentDialect: "british",
        autocomplete: "on"
      }}
    >

      {/* Wrap the rich text editor with <GrammarlyEditorPlugin> to add Grammarly suggestions  */}
      <GrammarlyEditorPlugin
        clientId={demoClientId}
        config={{
          documentDialect: "british",
          autocomplete: "on"
        }}
      >
        {/* Add a TinyMCE rich text editor */}
        <Editor
          initialValue={demoHeadline.textarea}
          init={{
            height: 200,
            menubar: true
          }}
          onChange={handleChangeHeadline}
        />
        <Editor
          id="content"
          initialValue={demoContent.textarea}
          init={{
            height: 500,
            menubar: true
          }}
          onChange={handleChangeContent}
        />
        <div className="col-md-3">
          <button className="btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px]" type="submit" onClick={handleSubmit}>Post</button>
       </div>
      </GrammarlyEditorPlugin>
    </Grammarly>
    </form>
    </div>
  );
};

export default Editors