const Search=({user})=>{
    return (<div className="text-left mt-3">
    <h1 className='text-yellow-400 text-[20px] font-bold'>Rating: {user?.rating || 0}</h1>
    <h1 className="text-blue-800 text-[20px] font-bold"><a href={'/profile/'+user?.nickname}>{user?.nickname || 'Nickname'}</a></h1>
    <div className="border-l-[4px] border-solid border-gray-400 px-3">
       <p>{user?.email || 'email'}</p>
       <p>Registered: {user?.createdtime.slice(0, 10) || 'time'}</p>
    </div>
</div>)
}
export default Search