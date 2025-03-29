import { Link, useNavigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css"
import "../../../node_modules/bootstrap/dist/js/bootstrap.min"
import logo from "../../images/logo.png"
import "../../css/header.css"
import { useEffect, useState } from "react";


function Header({isUserLoggedIn , setIsUserLoggedIn}) {
    const nav = useNavigate() ; 
    var logoutHandler=()=>{
        localStorage.clear() ; 
        sessionStorage.clear() ; 
        setIsUserLoggedIn(false) ; 
        window.alert("Thank you for using exam-wala 😊😊😊!")
        nav("/") ; 
    }
 
    


    var conditionalLinks = () => {
        if(isUserLoggedIn){
            return(

                <>
                <div className="col-md-2 col-sm-12 headerLinkDiv">
                <Link to="/myseries" className="headerLink">My Series</Link> 
                </div>
                <div className="col-md-2 col-sm-12 headerLinkDiv">
                <Link to="/myprofile" className="headerLink" >Profile</Link> 
                </div>
                <div className="col-md-2 col-sm-12 headerLinkDiv">
                <input type="button" className="btn headerLinkDiv headerLink" value="Logout" onClick={logoutHandler}></input>  
                </div>
                </>
            )
        }
        else{
            return(
                <>
                <div className="col-md-2 col-sm-12 headerLinkDiv">
                <Link to="/login" className="headerLink">Log in</Link> 
                </div>
                <div className="col-md-2 col-sm-12 headerLinkDiv">
                <Link to="/signup" className="headerLink" >Sign up</Link> 
                </div>
                </>
            )
        }
    }//end of conditionalLinks 


    return (
        <div className="container-fluid shadow row align-items-center justify-content-between m-0">
        <div className="img-fluid col-md-3">
            <img src={logo} style={{width:"100%"}} ></img> 
        </div>
            <div className="col-md-8 align-items-center justify-content-end row m-0">
            <div className="col-md-2 col-sm-12 headerLinkDiv">
            <Link to="/" className="headerLink" >Home</Link> 
            </div>
            <div className="col-md-2 col-sm-12 headerLinkDiv">
            <Link to="/freetests" className="headerLink" >Free Tests </Link> 
            </div>
            <div className="col-md-2 col-sm-12 headerLinkDiv">
            <Link to="/testseries" className="headerLink" > Test Series </Link> 
            </div>
            {conditionalLinks()}
            </div>
        </div>
    )
}//end of Header
export default Header;