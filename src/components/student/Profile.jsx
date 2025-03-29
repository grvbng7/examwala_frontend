import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../other/apiUrl";
import Aos from "aos";

function Profile(){


const nav = useNavigate() ;
var [userData , setUserData] = useState({id : "", fname : "" , lname : "" , email : "" , mobile : "" }) ; 
var [analysisArr , setAnalysisArr ] = useState([]) ;  

useEffect(()=>{
    Aos.init() ; 
var token = localStorage.getItem("token") ; 
if(token)
{
    axios.get(`${apiUrl}/myprofile`, 
        {
            headers: {
                'authorization':  token
            }
        })
        .then((respone)=>{
            userData = respone.data ; 
            setUserData({...userData}) ; 
        })//end of first axios call

        
        axios.get(`${apiUrl}/myprofile/testsgiven`, 
            {
                headers: {
                    'authorization': token
                }
            })
        .then((response)=>{
            analysisArr = response.data ; 
            setAnalysisArr([... analysisArr]) ; 
        })
    
}
else{
nav("/login") ; 
}} , [] )//end of useEffect






var profileInfoDiv = ()=>{ 
return (
    <div className="table-responsive col-md-5 mt-5" data-aos="fade-up" data-aos-duration="800">
    <h4> User  Basic Information </h4>
    <br/>
    <table className="table table-striped text-center">
        <tbody>
            <tr>
                <td>
                    User ID 
                </td>
                <td>
                    {userData.id}
                </td>
            </tr>
            <tr>
                <td>
                    Name
                </td>
                <td>
                    {userData.fname+" "+userData.lname}
                </td>
            </tr>
            <tr>
                <td>
                    Email
                </td>
                <td>
                    {userData.email}
                </td>
            </tr>
            <tr>
                <td>
                    Mobile
                </td>
                <td>
                    {userData.mobile}
                </td>
            </tr>
        </tbody>
    </table>
</div>            
)}

var performanceInfoDiv = ()=>{
    return(
        <>
        <h4> Tests Given till date </h4>
        <div className="table-responsive col-md-10" data-aos="fade-up" data-aos-duration="800">
            <table className="table table-striped text-center">
                <thead>
                    <tr>
                        <th>
                            सिरीज आयडी 
                        </th>
                        <th>
                            सिरीजचे नाव    
                        </th>
                        <th>
                            टेस्ट आयडी
                        </th>
                        <th>
                            टेस्टचे नाव 
                        </th>
                        <th>
                             प्रतिप्रश्न गुण
                        </th>
                        <th>
                            परीक्षेचा दिनांक
                        </th>
                        <th>
                            एकूण प्रश्न संख्या   
                        </th>
                        <th>
                            सोडवलेले प्रश्न   
                        </th>
                        <th>
                            बरोबर आलेले प्रश्न   
                        </th>
                        <th>
                            % accuracy   
                        </th>
                        <th>
                            मिळालेले गुण   
                        </th>
                        
                    </tr>
                </thead>
                <tbody>
                    {analysisArr.map((x , index) => {
                        return(
                    <tr key={index}>
                        <td>
                            {x.seriesId}
                        </td>
                        <td>
                            {x.sname}
                        </td>
                        <td>
                            {x.testId}
                        </td>
                        <td>
                            {x.tname}
                        </td>
                        <td>
                            {x.marksPerQuestion}
                        </td>
                        <td>
                            {x.examDate.substring(0, 10)}
                        </td>
                        <td>
                            {x.totalQuestions}
                        </td>
                        <td>
                            {x.attempted}
                        </td>
                        <td>
                            {x.correctAnswers}
                        </td>
                        <td>
                            {" "+(parseFloat((x.correctAnswers/x.attempted) * 100).toFixed(2))} %
                        </td>
                        <td>
                            {(x.correctAnswers - 0.25 * (x.attempted - x.correctAnswers ))*x.marksPerQuestion}/{x.totalQuestions * x.marksPerQuestion }
                        </td>
                    </tr>
                        )}
                        )}
                    
                </tbody>
            </table>
    </div>           
</>
)}



return (<div>
<center>
{profileInfoDiv()}
<hr/>
{performanceInfoDiv()}
</center>
</div>)}//end of Profile()

export default Profile ; 