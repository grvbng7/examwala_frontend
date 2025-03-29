import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import apiUrl from "../../other/apiUrl";
import axios from "axios";
import Aos from "aos";

function OtpValidation(){
    const location = useLocation() ;
    const nav = useNavigate() ;  
    var [validationData , setValidationData] = useState({"email":(location.state && location.state.email ? location.state.email:"") , otp:" " }) ; 
    var [isLoading, setIsLoading] = useState(false) ; 
    var [errMsg , setErrMsg] = useState("") ;
    var [verifySuccess , setverifySuccess] = useState(false) ; 
    
    useEffect(()=>{
        Aos.init() ; 
    })

    var onChangeHandler = (e) => {
        validationData[e.target.name] = e.target.value ; 
        setValidationData({...validationData}) ; 
    }

    var verifyOtpHandler = ()=>{
        axios.post(`${apiUrl}/user/verifyotp`,validationData)
        .then((resp)=>{
            if(resp.data.errorFlag == false || resp.data.errorFlag == "false" )
            {
                verifySuccess = true ; 
                setverifySuccess(verifySuccess) ;    
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
        isLoading = true ; 
        setIsLoading(isLoading) ; 
    }//end of verifyOtpHandler

    var otpValidationHeader = ()=>{
        return (<div id="pageHeader" className="d-flex justify-content-center ewBigFont">
        Just One more step  📚 ✍️ 🎯 🏆 <br/>
        </div>)
    } //end of signUpHeader()

    var inputDataTable =()=>{
        return (
            <div className="d-flex justify-content-center mt-1" data-aos="zoom-in" data-aos-duration="800">
    <div className="col-md-5 text-center">
    <table className="table table-striped">
    <tbody>
        <tr>
            <td>
                <b> Email </b> 
            </td>
            <td>
                <input name="email" type="text" className="form-control" onChange={onChangeHandler} placeholder="Enter your email here" value={validationData.email}></input> 
            </td>
        </tr>
        <tr>
            <td>
                <b> OTP </b> 
            </td>
            <td>
              <input name="otp" type="text" className="form-control" onChange={onChangeHandler} value={validationData.otp} ></input>
            </td>
        </tr>
    </tbody>
    </table>
    <p className="text-danger"> {errMsg} </p>
    <input type="button" disabled={isLoading} className="btn btn-danger" value="Verify Otp !!!" onClick={verifyOtpHandler}></input>
    </div>
    </div>
    )
    } //end of inputDataTable()
    
   var verificationComplete = () =>{
    return(
        <>
        <div id="pageHeader" className="d-flex mt-3 justify-content-center ewBigFont">
        Congratulations !! Welcome to 'Exam-Wala' family 📚 ✍️ 🎯 🏆 <br/>
        </div> 
        <hr/>
        <div className="d-flex mt-3 justify-content-center">
        Email address verification completed successfully !!! <br/>
        You can now login to your account !!!
        </div>
        <br/>
        <center>
        <input type="button" className="btn btn-danger" value="Go to login page" onClick={()=>{nav("/login")}} ></input>
        </center>
        </>
    )
   } 



return(
verifySuccess ? verificationComplete() : (
<div className="container-fluid mt-4">
{otpValidationHeader()}
<hr/>
{inputDataTable()}
</div> ))}//end of otp validation 
export default OtpValidation ; 