import contactDetails from "../../other/contactDetails"

function Steps(){

    var stepsHeader = ()=>{
        return (<div id="pageHeader" className="d-flex justify-content-center ewBigFont mt-5">
        📚 ✍️ टेस्ट सिरीज विकत घेण्यासाठीच्या स्टेप्स :   🎯 🏆 <br/>
        </div>)
    } //end of stepsHeader()

    var stepList =()=>{
        
        return(
            <div className="col-md-8 mt-4">
                <ul className="list-group" style={{textAlign:"left"}}>
                <li className="list-group-item"> ‣ &nbsp; Sign Up पेज वर जाऊन Sign up करा .</li>
                <li className="list-group-item"> ‣ &nbsp; तुमचा रजिस्टर केलेला ई-मेल किंवा मोबाईल क्रमांक  आणि तुम्हाला हव्या असलेल्या टेस्ट सीरिजचा सीरिज आयडी किंवा सिरीजचे नाव  - '{contactDetails.mobile}' या मोबाईल नंबर वर फोन करून कळवा. </li>
                <li className="list-group-item"> ‣ &nbsp; तुम्ही घेतलेल्या सिरीज ची फी '{contactDetails.mobile}' या नंबर वर PhonePe किंवा GPay करून भरू शकता व पेमेंटचा स्क्रीनशॉट त्याच नंबरच्या whatsapp वर पाठवा.</li>
                <li className="list-group-item"> ‣ &nbsp; त्यानंतर My Series मध्ये जाऊन तुम्ही घेतलेली टेस्ट सीरिज तुम्हाला सोडवता येईल.</li>
                <li className="list-group-item"> ‣ &nbsp; कोणतीही अडचण आल्यास किंवा अधिक माहितीसाठी आमच्या Support Team ला e-mail, what's app अथवा call करून मदत मिळवू शकता. </li>
                </ul>
                
            </div>
        )
    }

    return(
        <>
        {stepsHeader()}
        <center>
        {stepList()}
        </center>
        <div className="d-flex justify-content-center mt-5" style={{fontSize:"1.5em"}}>
        तुमच्या अभ्यासपूर्ण तयारीसाठी मनःपूर्वक शुभेच्छा !! <br/>
        </div>
        <hr/>
        <div className="ms-2">
            <code>
                Note to Developer : Payment Gateway Integration Pending ( To avoid above steps )  
            </code>
        </div>
        </>
    )


}//end of Steps()
export default Steps ; 