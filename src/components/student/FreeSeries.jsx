import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../other/apiUrl";
import Aos from "aos";

function FreeSeries(){
    var nav = useNavigate() ; 
    var [isChecked , setIsChecked] =  useState(false) ;
    var [showWarning , setShowWarning] =  useState(false) ; 
    var [freeTestInfo , setFreeTestInfo] = useState({}) ;
    var [tests , setTests] = useState([]) ;

    useEffect(()=>{

        Aos.init() ;

        axios.get(`${apiUrl}/freeseries`, {})
        .then(function(res){
            freeTestInfo = res.data ; 
            setFreeTestInfo({...freeTestInfo}) ;
        }) ; //end of first axios call 

        axios.get(`${apiUrl}/freeseries/tests`, {})
        .then(function(res){
            tests = res.data ; 
            setTests([...tests]) ;
        }) ; //end of second axios call







    }, [] )
    
    var freeTestInfoDiv = () => {
        return (
            <div className="col-md-6 p-4">
                <br></br>
                <b>सिरीज आयडी :</b> {freeTestInfo.id} <br/>
                <b> सिरीजचे नाव : </b>{freeTestInfo.name} <br/>
                <b>सिरीजबद्दल थोडक्यात माहिती :</b> {freeTestInfo.details} <br/>
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
                            <input type="button" className="btn btn-danger mt-3" value="Start Exam" onClick={()=>{goToStartFreeTest(x.testId , x.duration , x.marksPerQuestion)}} ></input>
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

    var goToStartFreeTest = (testId , duration , marksPerQuestion) => {
        if(isChecked){
            //nav("/startfreetest" , {state : {'testId' : testId }}) ;             
            nav("/startfreetest", { state : {"testId" : testId , "duration" : duration , "marksPerQuestion" : marksPerQuestion}} ) ; 
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
            {freeTestInfoDiv()}
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
        </div>
    )
}

export default FreeSeries ; 