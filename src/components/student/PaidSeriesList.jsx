import axios from "axios";
import { useEffect, useState } from "react";
import apiUrl from "../../other/apiUrl";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Aos from "aos";
function PaidSeriesList(){

    var [seriesDataArr , setSeriesDataArr ] = useState([]) ; 
    const nav = useNavigate() ; 
    
    useEffect( () => {
        Aos.init() ;
        axios.get(`${apiUrl}/f/allseriesdata`)
        .then((response)=>{
            seriesDataArr = response.data.data ; 
            setSeriesDataArr([... seriesDataArr]) ; 
        })
        .catch((error)=>{
            toast.error("Database error occured 😓 !! Please contact support team ") ; 
        })
    }, [])//end of useEffect()

    var goToStepsPage = () => {
        nav("/stepstobuy") ; 
    } // end of goToStepsPage()




    var paidSeriesHeader = ()=>{
        return (<div id="pageHeader" className="d-flex justify-content-center m-4 ewBigFont">
        📚 ✍️ सध्या सुरु असलेल्या टेस्ट सिरीज 🎯 🏆  <br/>
        </div>)
    } //end of signUpHeader()

    var paidSeriesDiv = ()=>
    {
        return (
        <div className="d-flex justify-content-center">
        <div className="col-md-8 col-10 col-sm-10">
        {
            
            seriesDataArr.map((series)=>{
                return(
                    <div key={series.id} className="card mt-3" data-aos="fade-right" data-aos-duration="800">
                        <h5 className="card-header"> सिरीज  आयडी : {series.id} </h5>
                        <div className="card-body">
                        <h5 className="card-title"> {series.name} </h5>
                        <p className="card-text"> {series.details} </p>
                        <p className="card-text"> 
                        {(series.dPrice == "" || series.dPrice == null)? <span style={{fontSize:"2em"}}> Rs. <span style={{color:"green" , fontSize:"2em"}}>{series.dPrice} </span></span> : <span style={{fontSize:"2em"}}> ₹ <s style=  {{color:"red"}}>  {series.price} </s> <span style={{color:"green"}}> &nbsp; {series.dPrice} </span></span> }
                        </p>
                        <input type="button" className="btn btn-danger" onClick={goToStepsPage} value="Buy this series"></input>
                        </div>
                        </div>   
            
            )})//end of map function    
        }
        </div>
        </div>
    )}//end of paid series div 





return(
<>
{paidSeriesHeader()}
<hr/>
{paidSeriesDiv()}
<ToastContainer />
</>
 )


}//end of PaidSeriesList
export default PaidSeriesList ; 