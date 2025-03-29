import { Route, Routes } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import FreeSeries from "../student/FreeSeries";
import StartFreeTest from "../student/StartFreeTest";
import TestAnalysis from "../student/FreeTestAnalysis";
import SignUp from "./SignUp";
import OtpValidation from "./OtpValidation";
import Login from "./Login";
import PaidSeriesList from "../student/PaidSeriesList";
import Steps from "../student/Steps";
import { useEffect, useState } from "react";
import MySeries from "../subscriber/MySeries";
import PaidSeries from "../subscriber/PaidSeries";
import StartTest from "../subscriber/StartTest";
import PaidTestAnalysis from "../subscriber/PaidTestAnalysis";
import Profile from "../student/Profile";

function Lander() {

    var [isUserLoggedIn , setIsUserLoggedIn]  =  useState(false) ; 

    useEffect(()=>{
    isUserLoggedIn  = !(localStorage.getItem("token") == "" || localStorage.getItem("token") == null)  
    setIsUserLoggedIn(isUserLoggedIn) ; 
    })//end of useEffect




    return (
        <>
        <Header isUserLoggedIn={isUserLoggedIn}  setIsUserLoggedIn= {setIsUserLoggedIn}/>
        <Routes>
            <Route path="/" exact="exact" element={<Home/>}  ></Route>
            <Route path="/signup" exact="exact" element={<SignUp/>}  ></Route>
            <Route path="/login" exact="exact" element={<Login setIsUserLoggedIn={setIsUserLoggedIn}/>}  ></Route>
            <Route path="/freetests" exact="exact" element={<FreeSeries/>}  ></Route>
            <Route path="/testseries" exact="exact" element={<PaidSeriesList/>}  ></Route>
            <Route path="/stepstobuy" exact="exact" element={<Steps/>}></Route>
            <Route path="/startfreetest" exact="exact" element={<StartFreeTest/>}  ></Route>
            <Route path="/freetest/analysis" exact="exact" element={<TestAnalysis/>}  ></Route>
            <Route path="/otpvalidation" exact="exact" element={<OtpValidation/>}></Route>
            
            
            <Route path="/myseries" exact="exact" element={<MySeries/>}  ></Route>
            <Route path="/paidseries" exact="exact" element={<PaidSeries/>}  ></Route>
            <Route path="/starttest" exact="exact" element={<StartTest/>}  ></Route>
            <Route path="/myseries/analysis" exact="exact" element={<PaidTestAnalysis/>}></Route>
            <Route path="/myprofile" exact="exact" element={<Profile/>}></Route>


        </Routes>
        <Footer/>
        </>
    )

}//end of lander

export default Lander;