import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiUrl from "../../other/apiUrl";
import { ToastContainer, toast } from "react-toastify";
import Aos from "aos";

function PaidSeries(){
    var nav = useNavigate() ; 
    var [isChecked , setIsChecked] =  useState(false) ;
    var [showWarning , setShowWarning] =  useState(false) ; 
    var [TestInfo , setTestInfo] = useState({}) ;
    var [tests , setTests] = useState([]) ;
    const location = useLocation() ; 

    useEffect(()=>{
        Aos.init() ; 
        if(location.state)
        var seriesId = location.state.seriesId ;
        else
        nav("/myseries") ; 
        if(seriesId == "" || seriesId == null){
            nav("/myseries") ; 
        }

        var token = localStorage.getItem("token") ;  
        //========================================================
        axios.get(`${apiUrl}/myseries/${seriesId}` , 
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function(res){
            TestInfo = res.data.data ; 
            setTestInfo({...TestInfo}) ;
        }) 
        .catch((error)=>{
            toast.error("Error occured 😓 !!  "+error.response.data.msg) ; 
         }) ; //end of first axios call

        //========================================================
        axios.get(`${apiUrl}/myseries/${seriesId}/tests`, 
            {
                headers: {
                    'Authorization': token
                }
            })
        .then((response)=>{
            tests = response.data ; 
            setTests([...tests]) ; 
        })
        .catch((error)=>{
           toast.error("Error occured 😓 !!  "+error.response.data.msg) ; 
        })
    
    }, [] )
    
    var TestInfoDiv = () => {
        return (
            <div className="col-md-6 p-4">
                <br></br>
                <b>सिरीज आयडी :</b> {TestInfo.id} <br/>
                <b> सिरीजचे नाव : </b>{TestInfo.name} <br/>
                <b>सिरीजबद्दल थोडक्यात माहिती :</b> {TestInfo.details} <br/>
                {showWarning ? warningDiv() : ""}
                {buttonsDiv()}
            </div>
        )
    }

    var buttonsDiv = () => {
        return (
            <div className="table-responsive">
            <table className="table table-striped text-center">
                <thead>
                    <tr>
                        <th>
                            Test id  
                        </th>
                        <th>
                            Name  
                        </th>
                        <th>
                            Information
                        </th>
                        <th>
                            Duration (HH:MM:SS) 
                        </th>
                        <th>
                            Marks Per Question
                        </th>
                        <th>
                            Pending attempts
                        </th>
                        <th>
                            Action  
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map(x => {
                        return(
                        <tr key={x.testId}>
                        <td>
                            {x.testId}
                        </td>
                        <td>
                            {x.name}
                        </td>
                        <td>
                            {x.description}
                        </td>
                        <td>
                            {x.duration}
                        </td>
                        <td>
                            {x.marksPerQuestion}
                        </td>
                        <td>
                            {x.pendingAttempts}
                        </td>
                        <td>
                            {(x.pendingAttempts > 0) ? 
                            <input type="button" className="btn btn-danger mt-3" value="Start Exam" onClick={()=>{goToStartTest(x.testId , x.duration , x.marksPerQuestion)}} ></input>
                                :
                            <p> All Attempts exhausted </p>
                        }
                        </td>
                    </tr>
                        )}
                        )}
                    
                </tbody>
            </table>
    </div>            
        )
    }

    
    
    
    var handleChange = (event)=> {
        isChecked = isChecked ? false : true ;    
        setIsChecked(isChecked) ;  
        if(isChecked){
            showWarning = false ; 
            setShowWarning(showWarning) ;
        }       
    } 

    var goToStartTest = (testId , duration , marksPerQuestion) => {
        if(isChecked){
            nav("/starttest", { state : {"seriesId" : location.state.seriesId , "testId" : testId , "duration" : duration , "marksPerQuestion" : marksPerQuestion}} ) ; 
        }
        else
        {
            showWarning = true ; 
            setShowWarning(showWarning) ;
        }

    }

    var warningDiv = () => {
       return <div className="text-danger"> Please select the checkbox , to confirm you read all the guidlines and marking scheme. </div>
    }

    return(
        <div className="container-fluid m-0 mt-5 p-1 row" data-aos="zoom-in" data-aos-duration="800">
            {TestInfoDiv()}
            <div className="col-md-6 p-0">
            Guidelines :
            <ul>
            <li> Before starting the exam , make sure that you have working internet connection </li>
            <li> Do not close the window / browser once you start the exam. </li>
            <li> Keep eye on timer. Test will be autosubmitted once the timer is over. </li>
            <li> You can change the answer any number of times. You can clear the answer if you want.</li>
            <li> 
                Colour schemes used in the question palette is as follows : 
                <br/>
                <input type="button" className="btn btn-warning m-1" value="1"></input> question not visited yet.
                <br/>
                <input type="button" className="btn btn-primary m-1" value="1"></input> visited but unanswered question
                <br/>
                <input type="button" className="btn btn-success m-1" value="1"></input> visited and answered question
                <br/> 
            </li>
            <li> Be honest with yourself.</li>
            </ul> 

            Marking Scheme :
            <ul>
            <li> Marks per correct ansers are mentioned in the table </li>
            <li> One-fourth negative marking is considered. </li>
            <li> You can not mark two answers of a single question. </li>
            <li> No marks will be deducted if you keep the question unanswered. </li>
            </ul> 

            <input type="checkbox" className="form-check-input" onChange={handleChange} value={isChecked}/>  I have read the guidlines and Marking scheme and I am ready to start the exam.
            <br/>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default PaidSeries ; 