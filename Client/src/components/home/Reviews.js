import Review from "./Review"
const Reviews=({reviews})=>{
   return (
    <div className="w-full">
        <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
           {reviews?.map(review=><Review review={review}/>)}
        </div>
    </div>
   )
}
export default Reviews