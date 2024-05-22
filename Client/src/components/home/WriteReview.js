import React, { useEffect, useRef, useState } from "react";
import { Grammarly, GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import "../../assets/css/style.css";
import { Editor } from "@tinymce/tinymce-react";
import { demoClientId, demoContent, demoHeadline } from "../demo";
import PostApi from "../../getApi/PostApi";
import HandleCookies from "../../utils/HandleCookies";
import { Rating } from "@mui/material";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useLocation } from "react-router-dom";
import ReviewApi from "../../getApi/ReviewApi";

const labels = {
  0.5: "Tồi Tệ",
  1: "Thất Vọng",
  1.5: "Không Hài Lòng",
  2: "Trung Bình",
  2.5: "Được",
  3: "Khá Tốt",
  3.5: "Tốt",
  4: "Hài Lòng",
  4.5: "Tuyệt",
  5: "Tuyệt Vời",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const WriteReview = () => {
  const [home, setHome]=useState(false);
  const location=useLocation();
  useEffect(()=>{
    const author = HandleCookies.getCookie("nickname");
    if(author!=null && author.length>0 && location?.pathname.split('/')[2]==author){
        setHome(true);
    }
  }, [])    
  const [content, setContent] = useState("Content");
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const author = HandleCookies.getCookie("nickname");
    if(author==null || author.length==0){
        alert("Please login to write review");
        return;
    }
    const usernickname=location?.pathname.split('/')[2];
    try {
      const res = await ReviewApi.createReview(value, labels[value], content, author, usernickname);
      alert("Your review created success");
      window.location.replace(location?.pathname);
    } catch (err) {
      alert("Oww! Something wrong");
    }
  };
  const handleChangeContent = (e) => {
    setContent(e.target.getContent());
  };
  return (
    <div className={home ? 'hidden' : 'w-full'}>
      <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
        <form>
          <div className="p-[20px]">
           <h1>Đánh Giá Chung:</h1> 
          <Box
            sx={{
              width: 300,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Rating
              name="hover-feedback"
              value={value}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
            {value !== null && (
              <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
          </Box>
          </div>
          <Grammarly
            clientId={demoClientId}
            config={{
              documentDialect: "british",
              autocomplete: "on",
            }}
          >
            {/* Wrap the rich text editor with <GrammarlyEditorPlugin> to add Grammarly suggestions  */}
            <GrammarlyEditorPlugin
              clientId={demoClientId}
              config={{
                documentDialect: "british",
                autocomplete: "on",
              }}
            >
              {/* Add a TinyMCE rich text editor */}
              <Editor
                id="content"
                initialValue={demoContent.textarea}
                init={{
                  height: 300,
                  menubar: true,
                }}
                onChange={handleChangeContent}
              />
              <div className="col-md-3 text-center">
                <button
                  className="btn btn-block btn-primary btn-lg bg-blue-500 rounded-sm px-5 py-3 text-white mt-[10px]"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Post
                </button>
              </div>
            </GrammarlyEditorPlugin>
          </Grammarly>
        </form>
      </div>
    </div>
  );
};
export default WriteReview;
