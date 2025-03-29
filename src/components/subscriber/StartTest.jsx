import { useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import axios, { all } from "axios";
import apiUrl from "../../other/apiUrl";
import Loading from "react-loading";
import { useTimer } from "react-timer-hook";
import "../../css/timer.css"

function StartTest(){ 
    const location = useLocation(); 
    var [testId , setTestId] = useState() ;
    var [seriesId , setSeriesId] = useState() ; 
    var [questionIds , setQuestionIds]  =  useState([]) ; 
    var [allAnswers , setAllAnswers] = useState([]) ;
    var [questionNo, setQuestionNo] = useState(1) ;
    var [isLoading , setIsLoading] = useState(true) ;
    var [currentQuestionData , setCurrentQuestionData ] = useState({id : "" ,  question : "" , o1 : "" , o2 : "" , o3 : "" , o4 : "" }) ; 
    var [submitTestLoading , setSubmitTestLoading] = useState(false) ;
    var time ; 
    
    if(localStorage.getItem("expiryTimestamp") == "" || localStorage.getItem("expiryTimestamp") == null || new Date(localStorage.getItem("expiryTimestamp")) <= new Date() ){
        var duration = location.state.duration ;
        var timeArr = duration.split(':') ;
        time =new Date() ;
        time.setHours(time.getHours()+ parseInt(timeArr[0])) ; 
        time.setMinutes(time.getMinutes() + parseInt(timeArr[1]) ) ;
        time.setSeconds(time.getSeconds() + parseInt(timeArr[2])) ; 
        localStorage.setItem("expiryTimestamp" , time ) 
    }
    else{
        var duration = location.state.duration ;
        time = new Date(localStorage.getItem("expiryTimestamp")) ;
    }

    

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp : time , onExpire: () => {submitTest(true)} }); 
    
    
    var nav =  useNavigate() ; 
    
    useEffect(() => { 
        window.history.replaceState(location.state , "" , "/" ) ;
        if(location.state)
        {
        testId =  location.state.testId  ;
        setTestId(testId) ;
        seriesId = location.state.seriesId ; 
        setSeriesId(seriesId) ;
        }
        else
        nav("/") ;
        
        var token = localStorage.getItem("token") ;
        //getting all the question ids for the perticular test         
        axios.get(`${apiUrl}/myseries/test/${testId}`, 
        {
            headers: {
                'authorization': token
            }
        })
        .then((resp) => {
                    questionIds = resp.data.questionIds ;
                    setQuestionIds([...questionIds]) ;
                    //-1 will show question visited but unanswerd 
                    //setting -2 in local storage for all unanswered and unvisited question question
                    //local storage would be usefull if user closes the browser and reopenes it.
                    questionIds.forEach((x , index)=> {
                        if(localStorage.getItem(x) == "" || localStorage.getItem(x) == null )
                        localStorage.setItem(x , -2)   ; 
                        allAnswers[index] = { questId : x , userAnswer : localStorage.getItem(x)} ;
                    }) ;  
                    //checking if 1st question was unanswerd previously before closing the browser
                    //if so then making it visited because 1st question will be always visited
                    if(allAnswers[0].userAnswer == -2 )
                    allAnswers[0].userAnswer = -1 ;  
                    setAllAnswers([...allAnswers]) ;
                    axios.get(`${apiUrl}/myseries/${seriesId}/${testId}/${questionIds[0]}`,
                    {
                        headers: {
                            'authorization': token
                        }
                    })
                    .then((resp) => {
                        currentQuestionData = resp.data ;
                        setCurrentQuestionData({...currentQuestionData}) ;
                        isLoading = false ; 
                        setIsLoading(isLoading) ;  
                    }) //end of inner axios then()
        })//end of outer axios then()  
        
    } , [])//end of useEffect


    var countDownTimer = () => {

        return(
            <center>
                <div className="col-md-3  m-3 timerContainer" >
                <div>
                Count Down : 
                </div>
                <div className="btn btn-dark m-1 timer">
                   {hours} 
                </div>
                <div className="btn btn-dark m-1 timer">
                    {minutes} 
                </div>
                <div className="btn btn-dark m-1 timer">
                   {seconds} 
                </div>
                </div>
        </center>
        )

    }//end of countDownTimer


    var submitTest = (autosubmit) => {
        if(!autosubmit) {
           var confirm =  window.confirm("Are you sure ? you want to submit the test") ;
           if(!confirm) {
            return ; 
           }
        }
        submitTestLoading = true  ;
        setSubmitTestLoading(submitTestLoading) ;
        var token = window.localStorage.getItem("token") ; 
        axios.post(`${apiUrl}/myseries/submittest/${seriesId}/${testId}`, allAnswers , 
        {
            headers: {
                'authorization':  token
            }
        })
        .then((resp)=>{
            for(var i=0 ; i < allAnswers.length ; i++ )
            localStorage.removeItem(allAnswers[i].questId) ;
            localStorage.removeItem("expiryTimestamp") ;
            submitTestLoading = false ;
            setSubmitTestLoading(submitTestLoading) ; 
            nav("/myseries/analysis", {state : { testId : testId , seriesId : seriesId , marksPerQuestion : location.state.marksPerQuestion ,  allAnswers : allAnswers , response : resp.data }} ) ;
        })  //end of then()




    }//end of submitTest()  




    var handleOptionSelect = (selectedOption)=>{
        allAnswers[questionNo - 1].userAnswer = selectedOption ;
        setAllAnswers([...allAnswers]) ; 
        var questId = allAnswers[questionNo - 1].questId ;
        localStorage.setItem(questId , selectedOption) ; 
    }//end of handleOptionSelect

    var handleQuestionNoClick = (index) =>  {
        var questId = allAnswers[index].questId ;  
        questionNo = index + 1 ; 
        setQuestionNo(questionNo) ;
        isLoading = true ;
        setIsLoading(isLoading) ; 

        //-2 represent unvisited unanswered code
        //-1 represent visited but unanswered code
        //logic : we want to change status of unvisited codes only to visited 
        //if it is already anserd then we do not want their status to be changed
        if(allAnswers[index].userAnswer == -2 ){
            allAnswers[index].userAnswer = -1 ;
            setAllAnswers([...allAnswers]) ; 
            localStorage.setItem(questId , -1) ; 
        }
        
        
        axios.get(`${apiUrl}/myseries/${seriesId}/${testId}/${questId}`, 
        {
            headers: {
                'authorization': window.localStorage.getItem("token") 
            }
        })
        .then((resp) => {
            isLoading = false ;
            setIsLoading(isLoading) ;
            currentQuestionData = resp.data ;
            setCurrentQuestionData({...currentQuestionData}) ; 
        })
    }//end of handleQuestionNoClick

    var handleClearAnswerBtn = (questId) => {
        allAnswers[questionNo - 1].userAnswer = "-1" ; 
        setAllAnswers([...allAnswers]) ; 
        localStorage.setItem(questId, "-1") ;
    }//end of handleClearAnswerBtn

    var handleNavigateQuestionBtn = (direction) => {
        if(direction == "next" && questionNo != questionIds.length )
        {
            handleQuestionNoClick(questionNo) ;
        }
        else if(direction == "previous" && questionNo != 1 )
        {
            handleQuestionNoClick(questionNo - 2 ) ;
        }
    }//end of handleNavigateQuestionBtn

    var questionDiv = () => {
        
        //i had to use this if loop because it was giving error allAnswers[questionNo] is undefined 
        //somehow questionNo was not getting initialized
        if(questionNo >= 1 && questionNo <= allAnswers.length)
        return (
        <div  className="col-md-8">
        <div className="card p-1 m-1">
        प्रश्न क्रमांक : {questionNo}
        </div>
        {isLoading ?  <div className="card p-1 m-1" style={{height:"100px"}}> We appreciate your patience !!! Data is being loaded ... <br/> <Loading color="crimson" type="spin" height={25} width={25}></Loading></div> :
        <div>
        <div className="card p-1 m-1">
        {currentQuestionData.question}
        </div>
        <div className="p-1 m-1 card">
        {currentQuestionData.imageName?<img src={`${apiUrl}/q/img/${currentQuestionData.imageName}`} className="img-fluid" alt={currentQuestionData.imageName}></img> : " "}
        <ol>
            <li>
            <input type="radio" name={`optionSelector${questionNo}`} value="1"  checked={allAnswers[questionNo -1].userAnswer == 1} onChange={()=>{handleOptionSelect(1)}}/>&nbsp; {currentQuestionData.o1}
            </li>
            <li>
            <input type="radio" name={`optionSelector${questionNo}`} value="2" checked={allAnswers[questionNo -1].userAnswer == 2} onChange={()=>{handleOptionSelect(2)}}/>&nbsp; {currentQuestionData.o2}
            </li>
            <li>
            <input type="radio" name={`optionSelector${questionNo}`} value="3" checked={allAnswers[questionNo -1].userAnswer == 3} onChange={()=>{handleOptionSelect(3)}}/>&nbsp; {currentQuestionData.o3}
            </li>
            <li>
            <input type="radio" name={`optionSelector${questionNo}`} value="4" checked={allAnswers[questionNo - 1].userAnswer == 4} onChange={()=>{handleOptionSelect(4)}}/>&nbsp; {currentQuestionData.o4}
            </li>
        </ol>
        </div>
        <div id="prevNextbuttons" >
        <input type="button" className="btn btn-danger m-1" value="<< Previous Question" onClick={()=>{handleNavigateQuestionBtn("previous")}}/>
        <input type="button" className="btn btn-danger m-1" value="clear Answer" onClick={()=>{handleClearAnswerBtn(currentQuestionData.id)}}/>
        <input type="button" className="btn btn-danger m-1" value="Next Question >> " onClick={()=>{handleNavigateQuestionBtn("next")}}/>
        </div> 
        </div>
        }    
        </div>) 
        else
        return <div> Some error occured </div>
        } //end of questionDiv

        
    if(submitTestLoading){
        return ( <div className="container-fluid row m-0 mt-5" > 
                <span style={{fontSize : "larger" , fontWeight : "900"}}> We are processing your data. Please wait .... </span>
                <br/>
                <Loading color="crimson" type="spin" height={50} width={50}></Loading>    
             </div> )
    }   
    else  
    return(

        <div className="container-fluid row m-0 mt-5">
        {countDownTimer()}
        <div className="col-md-3" > 
        {questionIds.map((questionId , index) => {   
        return( 
        <button
            key={questionId}
            className={`btn btn-${allAnswers[index].userAnswer == "-2" ? "warning" : (allAnswers[index].userAnswer == "-1" ? "primary"  : "success")} m-1 col-md-2`}
            onClick={() => handleQuestionNoClick(index)}>
            {index + 1}
        </button>
        )
        })}
        </div>
        {questionDiv()}
        <hr className="mt-2"/>
        <center>
        <div className="mt-2">
        <input type="button" className="btn btn-danger" value="submit test" onClick={()=>{submitTest(false)}}></input>
        </div>
        </center>
        </div>
    )
}

export default StartTest;