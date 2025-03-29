import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import apiUrl from "../../other/apiUrl";
import Aos from "aos";

function MySeries(){
    var [seriesDataArr , setSeriesDataArr ] = useState([]) ; 
    const nav = useNavigate() ; 
    
    useEffect( () => {
        Aos.init() ; 
        var token = localStorage.getItem("token") ; 
        axios.get(`${apiUrl}/myseries`, 
            {
                headers: {
                    'authorization': token
                }
            })
        .then((response)=>{
            seriesDataArr = response.data.data ; 
            setSeriesDataArr([... seriesDataArr]) ; 
        })
        .catch((error)=>{
           toast.error("Error occured 😓 !!  "+error.response.data.msg) ; 
        })
    }, [])//end of useEffect()








    var solveHandler = (seriesId) => {
        nav("/paidseries",{state:{"seriesId" : seriesId }}) ; 
    } // end of goToStepsPage()

    var mySeriesHeader = ()=>{
        return (<div id="pageHeader" className="d-flex justify-content-center m-4 ewBigFont">
        📚 ✍️ Purchased Series 🎯 🏆<br/>
        </div>)
    } //end of mySeriesHeader()


    var mySeriesDiv = ()=>
    {
        return (
        <div className="d-flex justify-content-center">
        <div className="col-md-8 col-sm-10 col-10">
        {   
            seriesDataArr.map((series)=>{
                return(
                    <div key={series.id} className="card mt-3" data-aos="fade-right" data-aos-duration="800">
                        <h5 className="card-header"> सिरीज  आयडी : {series.id} </h5>
                        <div className="card-body">
                        <h5 className="card-title"> {series.name} </h5>
                        <p className="card-text"> {series.details} </p>
                        <input type="button" className="btn btn-danger" onClick={()=>{solveHandler(series.id);}} value="Solve"></input>
                        </div>
                        </div>   
            
            )})//end of map function    
        }
        </div>
        </div>
    )}//end of my series div


return (
<>
{mySeriesHeader()}
<hr/>
{mySeriesDiv()}
<ToastContainer/>
</>)}//end of MySeries Function 
export default MySeries ; 