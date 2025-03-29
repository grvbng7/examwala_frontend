import { useEffect, useState } from "react"
import "../../css/ew.css"
import axios from "axios";
import apiUrl from "../../other/apiUrl";
import Loading from "react-loading";
import { useNavigate} from "react-router-dom";
import Aos from "aos";

function SignUp(){
    var [userData , setUserData] =  useState({"fname":"" , "lname" : "" , "email" : "" , "mobile" : "" , "password" : "" , "confirmPassword" : "" }) ; 
    //instead of null string I passed 'space' in each error msg because I used logic based on it in signUpHandler button
   var [errorMsg , setErrorMsg] =   useState({"fname":" " , "lname" : " " , "email" : " " , "mobile" : " " , "password" : " " , "confirmPassword" : " " }) ; 
    var [superErr , setSuperErr] = useState("") ; 
    var [isLoading , setIsLoading] = useState(false) ; 
    var [respErrMsg , setRespErrMsg]  = useState("") ; 
    const nav = useNavigate() ;

useEffect(()=>{
Aos.init()  ;
})
var onChangeHandler = (e) => {
    userData[e.target.name] = e.target.value ; 
    setUserData({...userData}) ;
    if(e.target.name == "confirmPassword"){
        if(userData.password == userData.confirmPassword){
            errorMsg.confirmPassword = "" ; 
            setErrorMsg({...errorMsg}) ; 
        }
        else{
            errorMsg.confirmPassword = "Passwords do not match" ; 
            setErrorMsg({... errorMsg}) ; 
        }
    }
}//end of onchangeHandler()


var signUpHandler = ()=>{
    //Remember to check hasOwnProperty() inside the for...in loop 
    //to ensure that you're only considering the object's own properties, 
    //not inherited ones from the prototype chain. 
    //This is to ensure you're working specifically with the keys and properties of the object itself.
    
    //k stands for key or your can use Object.keys(object name) --> this returns array of key names 
    
    for(var k in errorMsg) {
        if(errorMsg.hasOwnProperty(k))
        {
            if(errorMsg[k] != "")
            {
                superErr = "You can not proceed with invalid data input" ; 
                setSuperErr(superErr) ; 
                return ; 
            }
        }
    }//end of for 
    //if we are out of for means data is valid now creating the package and sending the data.

    var packet = {} ; 
    packet.fname = userData.fname.toLowerCase() ;   
    packet.lname = userData.lname.toLowerCase() ;
    packet.email = userData.email.toLowerCase() ;
    var {mobile , password } = userData ; 
    packet = {...packet , mobile , password} ; 
    axios.post(`${apiUrl}/user/signuprequest` , packet )
    .then((resp)=>{
        if(resp.data.errorFlag == false || resp.data.errorFlag == "false" )
        {
            //nave to next page
            nav("/otpvalidation" , {state : {email : packet.email }}) ; 
        }
        else{
            respErrMsg = resp.data.msg ; 
            setRespErrMsg(respErrMsg) ; 
        }
    })
    .catch((err)=>{ 
            respErrMsg = err.response.data.msg ; 
            setRespErrMsg(respErrMsg) ; 
    })
    isLoading = true ; 
    setIsLoading(isLoading) ;

}//end of signUpHandler()



var onBlurHandler = (e) =>{
    switch (e.target.name){
        case "lname" : 
        case "fname" :
            if(userData.fname.length >= 3){
                errorMsg[e.target.name] = "" ; 
                setErrorMsg({...errorMsg}) ; 
            }  
            else{
                errorMsg[e.target.name] = "Please enter valid data" ; 
                setErrorMsg({...errorMsg}) ; 
            }
        break ;
        case "email" :
            if(userData.email.length >= 5 && userData.email.includes("@") && userData.email.includes(".") )
            {
                errorMsg.email = "" ; 
                setErrorMsg({...errorMsg}) ; 
            } 
            else{
                errorMsg.email = "Please enter valid email address" ; 
                setErrorMsg({...errorMsg}) ; 
            }
        break ;
        case "mobile" : 
        if(userData.mobile.length == 10 && /^\d+$/.test(userData.mobile) )
            {
                errorMsg.mobile = "" ; 
                setErrorMsg({...errorMsg}) ; 
            } 
            else{
                errorMsg.mobile = "Please enter valid mobile number " ; 
                setErrorMsg({...errorMsg}) ; 
            }
        break ; 
        case "password" : 
        if(userData.password.length >= 8 )
            {
                errorMsg.password = "" ; 
                setErrorMsg({...errorMsg}) ; 
            } 
            else{
                errorMsg.password = "Password length should be atleast 8 characters " ; 
                setErrorMsg({...errorMsg}) ; 
            }

    }//end of switch
}//end of onBlurHandler()



var signUpHeader = ()=>{
    return (<div id="pageHeader" className="d-flex justify-content-center ewBigFont">
    📚 ✍️ Thank you for trusting Exam Wala  🎯 🏆 <br/>
    </div>)
} //end of signUpHeader()

var registrationTable =()=>{
    return (
<div className="d-flex justify-content-center mt-1" data-aos="zoom-in" data-aos-duration="800">
<div className="col-md-5 text-center">
<table className="table table-striped">
<tbody>
    <tr>
        <td>
            <b> First Name  </b> 
        </td>
        <td>
            <input name="fname" type="text" className="form-control" placeholder="Enter your first name here" onChange={onChangeHandler} value={userData.fname} onBlur={onBlurHandler}></input> 
            <p className="text-danger"> {errorMsg.fname} </p>
        </td>
    </tr>
    <tr>
        <td>
            <b> Last Name  </b> 
        </td>
        <td>
            <input name="lname" type="text" className="form-control" placeholder="Enter your last name here" onChange={onChangeHandler} value={userData.lname} onBlur={onBlurHandler}></input> 
            <p className="text-danger"> {errorMsg.lname} </p>
        </td>
    </tr>
    <tr>
        <td>
            <b> Email  </b> 
        </td>
        <td>
            <input name="email" type="text" title="you will get an otp on this mail" className="form-control" placeholder="you will get an otp on this mail" onChange={onChangeHandler} value={userData.email} onBlur={onBlurHandler}></input> 
            <p className="text-danger"> {errorMsg.email} </p>
        </td>
    </tr>
    <tr>
        <td>
            <b> Mobile  </b> 
        </td>
        <td>
            <input name="mobile" type="text" title="support team will reach you soon" className="form-control" placeholder="support team will reach you soon" onChange={onChangeHandler} value={userData.mobile} onBlur={onBlurHandler}></input> 
            <p className="text-danger"> {errorMsg.mobile} </p>
        </td>
    </tr>
    <tr>
        <td>
            <b> Password  </b> 
        </td>
        <td>
          <input name="password" type="password" title="We recomend using a strong password" className="form-control" placeholder="We recomend using a strong password" onChange={onChangeHandler} value={userData.password} onBlur={onBlurHandler}></input>
          <p className="text-danger"> {errorMsg.password} </p>
        </td>
    </tr>
    <tr>
        <td>
            <b> Confirm Password  </b> 
        </td>
        <td>
          <input name="confirmPassword" type="password" title="We recomend using a strong password" className="form-control" placeholder="We recomend using a strong password" onChange={onChangeHandler} value={userData.confirmPassword} ></input>
          <p className="text-danger"> {errorMsg.confirmPassword} </p>
        </td>
    </tr>
        
</tbody>
</table>
<p className="text-danger"> {superErr} </p>
<input type="button" disabled={isLoading} className="btn btn-danger" value="Let's crack the exam !!!" onClick={signUpHandler}></input>
</div>
</div>
)
} //end of registrationTable()

var studentNotice = ()=>{
    return(
<div id="notice" className="mt-3 d-flex justify-content-center" data-aos="fade-up" data-aos-duration="800">
<ul>
Important notice for students : <br/>
<li> Please ensure that details about your email and mobile number are correct </li>
<li> These details will be used to connect with you in future.<br/></li>
<li> Once you click 'Signup' button you will be redirected to Otp Verification page.</li>
<li> You will get an otp on your registered email address.</li>
<li> For security reasons we limit the numer of otp requests.</li>
<li> If you dont recieve an email you can always contact our customer support.</li>
</ul>
</div>
    )
}//end of studentNotice()


var wholePage = ()=>{
    return (<div className="container-fluid mt-4">
    {signUpHeader()} 
    <hr/>
    {isLoading ? <div className="card p-1 m-1" style={{height:"100px"}}> We appreciate your patience !!! Please do not refresh the page ... <br/>Interesting fact : According to our performance testing , It would take maximum 12 seconds. <Loading color="crimson" type="spin" height={25} width={25}></Loading> </div> : registrationTable()}
    <hr/> 
    {studentNotice()}
    <hr/>
    </div> 
    )
}

var respErrorHtml = ()=>{
    return(
    <div className="container-fluid mt-4">
    {signUpHeader()} 
    <hr/>
    <p className="text-danger"> {respErrMsg} <br/>   
    </p>
    <p>
    Please try to resolve the above issue . <br/>
    If error still persists , 
    Please note down the error and 
    contact our student helpline number.<br/>
    We are extreamly sorry for the inconvenience. 
    </p>

    </div>
    )
}//end of respErrorHtml


return(
    <>
    {(respErrMsg != "") ? respErrorHtml() : wholePage() }
    </>
)
}//end of SignUp
export default SignUp ; 