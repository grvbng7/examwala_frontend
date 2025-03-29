import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiUrl from "../../other/apiUrl";
import Loading from "react-loading";
import "bootstrap-icons/font/bootstrap-icons.css"
function PaidTestAnalysis() {
    const reportDivRef  =  useRef() ; 
    var [seriesId , setSeriesId] = useState() ;
    var [testId , setTestId] = useState() ;
    var [marksPerQuestion , setMarksPerQuestion ] = useState() ; 
    var [questionNo, setQuestionNo] = useState(1) ;
    //isLoading variable shows if question is loading 
    var [isLoading , setIsLoading] = useState(true) ;
    var [currentQuestionData , setCurrentQuestionData ] = useState({}) ;
    var [highlightOptions , setHighlightOptions] = useState({classForOption1 : " " , classForOption2 : " " , classForOption3 : " " , classForOption4 : " "}) ; 
    
    var location =  useLocation() ; 
    var {allAnswers , response} = location.state ;
    var {subjectWiseAnalysisArray , testResult } = response ;
    
    const nav = useNavigate() ; 
      
    
    useEffect(()=>{ 
        var token = window.localStorage.getItem("token") ; 
        testId = location.state.testId ; 
        setTestId(testId) ;
        seriesId = location.state.seriesId ; 
        setSeriesId(seriesId) ; 
        marksPerQuestion = location.state.marksPerQuestion ; 
        setMarksPerQuestion(marksPerQuestion) ; 
        axios.get(`${apiUrl}/myseries/analysis/${seriesId}/${testId}/${allAnswers[0].questId}`,
        {
            headers: {
                'authorization':  token
            }
        }
        )
        .then((resp) => {
            currentQuestionData = resp.data ;
            setCurrentQuestionData({...currentQuestionData}) ;
            highlightAppropriateOptions() ;
            isLoading = false ; 
            setIsLoading(isLoading) ;  
        }) //end of inner axios then()
    } , [])//end of useEffect

    var highlightAppropriateOptions = ()=> {
        highlightOptions =  {classForOption1 : " " , classForOption2 : " " , classForOption3 : " " , classForOption4 : " "} ;
        if(testResult[questionNo - 1] == 0){
            highlightOptions["classForOption"+allAnswers[questionNo - 1].userAnswer] = "list-group-item-danger" ;  
        }
        highlightOptions["classForOption"+currentQuestionData.correctOption] = "list-group-item-success" ;
        setHighlightOptions({...highlightOptions}) ;
    } 

    var handleQuestionNoClick = (index) => {
        var token = window.localStorage.getItem("token") ; 
        var questId = allAnswers[index].questId ;  
        questionNo = index + 1 ; 
        setQuestionNo(questionNo) ;
        isLoading = true ;
        setIsLoading(isLoading) ;
        axios.get(`${apiUrl}/myseries/analysis/${seriesId}/${testId}/${questId}`,
        {
            headers: {
                'authorization':  token
            }
        })
        .then((resp) => {
            isLoading = false ;
            setIsLoading(isLoading) ;
            currentQuestionData = resp.data ;
            setCurrentQuestionData({...currentQuestionData}) ;
            highlightAppropriateOptions() ; 
        })

    }//end of handleQuestionNoClick


    var downloadReport = () =>{
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
      <title> Performance Report </title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      </head>
          <body>
          <center>
          <h2><b>Exam Wala Web App</b></h2> 
          </center>
          <div>
          ${reportDivRef.current.innerHTML}
          </div>
          <script>
          window.print() ;
          window.close() ;  
          </script>
          </body>
      </html>
    `);
    }//end of downloadReport

    var handleNavigateQuestionBtn = (direction)=>{
        if(direction == "next" && questionNo != allAnswers.length )
        {
            handleQuestionNoClick(questionNo) ;
        }
        else if(direction == "previous" && questionNo != 1 )
        {
            handleQuestionNoClick(questionNo - 2 ) ;
        }        
    }//end of handleNavigateQuestionBtn

    
    var instructions = ()=>{
        return (
        <div id="instructions" className="m-2 container-fluid row justify-content-around">
        <div className="m-2 col-md-5" style={{border : "black 1px solid" , borderRadius: "10px"}}>
           <ul>
           <b><u>color scheme </u> : </b>
            <li><button className="btn btn-success m-1"> 1 </button> उत्तर बरोबर आलेला प्रश्न </li>
            <li> <button className="btn btn-warning m-1"> 1 </button> attempt न केलेला  प्रश्न</li>
            <li><button className="btn btn-danger m-1"> 1 </button> उत्तर चुकलेला प्रश्न </li>
           </ul>
        </div>
        <div className="m-2 col-md-5" style={{border : "black 1px solid" , borderRadius: "10px"}}>
           <ul>
           <b><u> इतर सूचना</u>  : </b>
            <li> खाली दिलेला performance report तुम्ही फक्त एकदाच पाहू शकता. </li>
            <li>वरील बाब विचारात घेऊन , window / browser  बंद करण्याआधी विश्लेषन नीट पाहून घेणे विद्यार्थ्यांच्या हिताचे राहील.</li>
            <li> तुम्ही हा रिपोर्ट नंतरच्या वापरासाठी pdf  स्वरूपात डाउनलोड करून ठेऊ शकता.</li>
           </ul>
        </div>
    </div>
    )

    }//end of instructions() 
    
    var questionPalette = ()=>{
        return (
        <div id="questionPalette" className="col-md-3">
        {testResult.map((result , index) => {   
        return(
            <button
            key={index}
            className={`btn btn-${result == "-2" || result == "-1"  ? "warning" : (result == "1" ? "success"  : "danger")} m-1 col-md-2`}
            onClick={() => handleQuestionNoClick(index)}>
            {index + 1}
            </button>
        )
        })}
        </div>
        )
    }//end of questionPalettes


    var questionDiv = () => {
        
        //i had to use this if loop because it was giving error allAnswers[questionNo] is undefined 
        //somehow questionNo was not getting initialized
        if(questionNo >= 1 && questionNo <= allAnswers.length)
        return (
        <div className="col-md-8">
        <div className="card container-fluid p-1 m-1">
        <div>
        आतापर्यंत <b className="text-danger">{" "+parseFloat((parseFloat(currentQuestionData.correctAnswers)/parseFloat(currentQuestionData.attempts) *100).toFixed(2)) }</b> टक्के विद्यार्थ्यांनी या प्रश्नाचे बरोबर उत्तर दिले आहे.
        </div>
        <div>
        प्रश्न क्रमांक : {questionNo} <br/>
        </div>
        </div>
        {isLoading ?  <div className="card p-1 m-1" style={{height:"100px"}}> We appreciate your patience !!! Data is being loaded ... <br/> <Loading color="crimson" type="spin" height={25} width={25}></Loading></div> :
        <div>
        <div className="card p-1 m-1">
        {currentQuestionData.question}
        </div>
        <div className="p-1 m-1 card">
        {currentQuestionData.imageName?<img src={`${apiUrl}/q/img/${currentQuestionData.imageName}`} className="img-fluid" alt={currentQuestionData.imageName}></img> : " "}
        <ol className="list-group list-group-numbered">
            <li className={`list-group-item ${highlightOptions.classForOption1}`}>
            {currentQuestionData.o1}
            </li>
            <li className={`list-group-item ${highlightOptions.classForOption2}`}>
            {currentQuestionData.o2}
            </li>
            <li className={`list-group-item ${highlightOptions.classForOption3}`}>
            {currentQuestionData.o3}
            </li>
            <li className={`list-group-item ${highlightOptions.classForOption4}`}>
            {currentQuestionData.o4} 
            </li>
        </ol>
        </div>
        <div id="prevNextbuttons" >
        <input type="button" className="btn btn-danger m-1" value="<< Previous Question" onClick={()=>{handleNavigateQuestionBtn("previous")}}/>
        <input type="button" className="btn btn-danger m-1" value="Next Question >> " onClick={()=>{handleNavigateQuestionBtn("next")}}/>
        </div> 
        </div>
        }    
        </div>) 
        else
        return <div> Some error occured </div>
        } //end of questionDiv
        
        var countOccurrencesOfElementInArray = (arr, target) => {
            let count = 0;
            arr.forEach((element) => {
              if (element == target) {
                count++;
              }
            });
            return count;
        }//end of countOccurrencesOfElementInArray

        var report = ()=>{
            var correct = countOccurrencesOfElementInArray(testResult , 1 ) ; 
            var wrong = countOccurrencesOfElementInArray(testResult , 0 ) ; 
            var unattempted = countOccurrencesOfElementInArray(testResult , -1 ) ;
            unattempted += countOccurrencesOfElementInArray(testResult , -2 ) ;
            var marks = (correct * marksPerQuestion )- (0.25 * marksPerQuestion * wrong) ;   

            return (
                <div id="report" ref={reportDivRef} className="row container-fluid justify-content-around m-0 mt-3">
                <div className="col-md-5">
                    <h5> Overview : </h5>
                    <table className="table table-striped">
                        <tbody>
                    <tr>
                        <td>
                            टेस्ट आयडी  
                        </td>
                        <td>
                            {testId}     
                        </td>
                    </tr>
                    <tr>
                        <td>
                        प्रतिप्रश्न गुण  
                        </td>
                        <td>
                            {marksPerQuestion}   
                        </td>
                    </tr>
                    <tr>
                        <td>
                            एकूण प्रश्न संख्या 
                        </td>
                        <td>
                            {testResult.length}   
                        </td>
                    </tr> 
                    <tr>
                        <td>
                            एकूण सोडवलेले प्रश्न    
                        </td>
                        <td>
                            {testResult.length - unattempted}   
                        </td>
                    </tr>
                    <tr>
                        <td>
                            attempt न केलेले प्रश्न   
                        </td>
                        <td>
                            {unattempted}   
                        </td>
                    </tr>
                    <tr>
                        <td>
                            बरोबर आलेले प्रश्न  
                        </td>
                        <td>
                            {correct+" "}    
                        </td>
                    </tr> 
                    <tr>
                        <td>
                           Percentage Accuracy 
                        </td>
                        <td>
                            {" "+parseFloat(correct / (testResult.length - unattempted) * 100).toFixed(2) } %   
                        </td>
                    </tr>
                    <tr>
                        <td>
                            मिळालेले गुण 
                        </td>
                        <td>
                            {marks+"  "} / {" "+(testResult.length * marksPerQuestion)}   
                        </td>
                    </tr>  
                    </tbody>
                    </table>
                </div>
                <hr/>
                <div className="col-md-8 table-responsive">
                    <h5> Subject Wise Analysis : </h5>
                    <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>
                        विषय 
                        </th>
                        <th>
                        प्रश्न संख्या
                        </th>
                        <th>
                        सोडलेले प्रश्न
                        </th>
                        <th>
                            बरोबर आलेले प्रश्न  
                        </th>
                        <th>
                        Accuracy  
                        </th>
                        <th>
                        गुण  
                        </th>
                    </tr>
                    </thead>  
                    <tbody>
                        { subjectWiseAnalysisArray.map((obj) =>{
                            return(
                                <tr key={obj.subjectId}>
                                    <td>
                                    {obj.subjectName}
                                    </td>
                                    <td>
                                    {obj.numberOfQuestions}
                                    </td>
                                    <td>
                                    {obj.numberOfQuestions - obj.unanswerdQuestion}
                                    </td>
                                    <td>
                                    {obj.numberOfCorrectAnswers}
                                    </td>
                                    <td>
                                    {
                                    isNaN(((obj.numberOfCorrectAnswers / (obj.numberOfQuestions - obj.unanswerdQuestion) * 100 )).toFixed(2))? "---" : ((obj.numberOfCorrectAnswers / (obj.numberOfQuestions - obj.unanswerdQuestion) * 100 )).toFixed(2) +" %" 
                                    }
                                    </td>
                                    <td>
                                    {obj.subjectName}
                                    </td>
                            </tr>
                            )
                         })//end of map 
                        }
                    </tbody>
                    </table>
                </div>
                </div>
            )
        }//end of report 

    
    return (<div className="container-fluid mt-5 row "> 
    <center>
        <h3> Performance Report </h3>
    </center>
    <hr className="m-3"/> 
    {instructions()}
    <hr className="m-3"/>
    {questionPalette()}
    {questionDiv()}
    <hr className="m-3"/> 
    <center>
    <div>
    <input type="button" className="btn btn-danger" value="रिपोर्ट pdf डाउनलोड करा " onClick={downloadReport}></input>    
    </div>
    </center>
    {report()}
    </div>)
}//end of TestAnalysis
export default PaidTestAnalysis;