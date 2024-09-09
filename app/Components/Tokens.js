"use client"

 const Tokens=(token)=>{

    return <div className="flex justify-between items-center py-2">
        <div className="w-[fit-content] flex items-center">
            <img className="w-[4vw] h-[4vw] p-1" src={token.prop.img}/>
            <div>
            {token.prop.name}
            <br/>
            {"1 "+token.prop.name + "= $" + token.prop.price }        
            </div>
        </div>
        <div className="">
            <div>
                {"$ "+token.prop.usd}
            </div>
        </div>
    </div>
}

export default Tokens;