import openai from '../../assets/image/openai.jpg'
import microsoft from '../../assets/image/microsoft.jpg'

const Footer=()=>{
    return (
        <div className="text-center mt-10">
           <p><span className="underline hover:cursor-pointer"><a href='http://localhost:3000/'>Codeforces</a></span> Copyright 2003-2023 Vu Nguyen Tien</p>
           <p>The Web 1.0 platform</p>
           <h4>Supported by</h4>
           <div className='text-center'>
              <a href='https://openai.com/'><img src={openai} className='w-40 inline-flex'/></a>
              <a href='https://www.microsoft.com/'><img src={microsoft} className='w-20 inline-flex'/></a>
           </div>
        </div>
    )
}
export default Footer