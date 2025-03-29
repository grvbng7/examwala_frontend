import { useEffect, useState } from "react";
import apiUrl from "../../other/apiUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Aos from "aos";

function Login({setIsUserLoggedIn}){

    var [loginData , setLoginData] = useState({"username": "" , "password" : "" }) ; 
    var [isLoading, setIsLoading] = useState(false) ; 
    var [errMsg , setErrMsg] = useState("") ;
    const nav = useNavigate() ; 

useEffect(()=>{
Aos.init() ; 
},[])


var loginPageHeader =()=> {
return (
    <div id="pageHeader" className="d-flex mt-3 justify-content-center ewBigFont">
    Login <br/>
    </div> )
}//end of loginPageHeader

var onChangeHandler= (e)=>{
    loginData[e.target.name] = e.target.value ; 
    setLoginData({...loginData})  ; 
}//onChangeHandler()

var logInHandler = ( )=> {
    axios.post(`${apiUrl}/user/login` , loginData)
    .then((resp) => {
        if(resp.data.errorFlag == false || resp.data.errorFlag == "false" )
        {
             window.localStorage.setItem("token" , resp.data.token ) ;
             setIsUserLoggedIn(true) ; 
             nav("/myprofile");    
        }
        else{
            isLoading = false ; 
            setIsLoading(isLoading) ; 
            errMsg = resp.data.msg ; 
            setErrMsg(errMsg) ;
        }
    })
    .catch((err)=>{ 
            isLoading = false ; 
            setIsLoading(isLoading) ; 
            errMsg = err.response.data.msg ; 
            setErrMsg(errMsg) ;
        })
    errMsg = "We are processing user login request !! Please wait ..."
    setErrMsg(errMsg) ; 
    isLoading = true ; 
    setIsLoading(isLoading) ; 
}


var loginDataTable= () =>{
return (
<div  className="d-flex justify-content-center mt-1" data-aos="zoom-in" data-aos-duration="800">
<div className="col-md-5 text-center">
<table className="table table-striped">
<tbody>
    <tr>
        <td>
            <b> Username  </b> 
        </td>
        <td>
            <input name="username" type="text" className="form-control" onChange={onChangeHandler} placeholder="email or mobile number" value={loginData.email}></input> 
        </td>
    </tr>
    <tr>
        <td>
            <b> Password </b> 
        </td>
        <td>
          <input name="password" placeholder="Enter your password" type="password" className="form-control" onChange={onChangeHandler} value={loginData.otp} ></input>
        </td>
    </tr>
</tbody>
</table>
<p className="text-danger"> {errMsg} </p>
<input type="button" disabled={isLoading} className="btn btn-danger" value="Log In" onClick={logInHandler}></input>
</div>
</div>
)} // loginDataTable



return(
<>
{loginPageHeader()} 
<hr/>
{loginDataTable()}
<hr/>
</>
)

}//end of Login 
export default Login ; 
