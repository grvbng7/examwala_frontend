import girlImg from "../../images/girl_img.jpg";
import "../../css/home.css"
import 'aos/dist/aos.css';
import { useEffect } from "react";
import Aos from "aos";
function Home(){
    useEffect(()=>{
        Aos.init() ; 

    }, [])

    return (
        <div className="mt-4 container-fluid row align-items-center justify-content-between">
        <div className="col-md-6 img-fluid" data-aos="fade-right" data-aos-duration="800">
        <img src={girlImg} alt="GirlImg" width={"100%"}/> 
        </div>
        <div className="col-md-6 text-justify p-5 introInfo" data-aos="fade-left" data-aos-duration="800">
        <p>
        स्पर्धा परीक्षांची तयारी करणाऱ्या सर्व मित्र मैत्रीणींना ,
        <br/> 
        नमस्कार !!!
        <br/>
        सध्या वाढत चाललेली स्पर्धा परीक्षांमधील स्पर्धा आपल्यासाठी काही नवीन नाही.
        <br/>
        स्पर्धेच्या या युगात  यशस्वी व्हायचं असेल तर सामान्यांपेक्षा वेगळ्या गोष्टी करण्याची गरज नाही तर सामान्य गोष्टीच जरा वेगळ्या पद्धतीने करण्याची गरज असते. 
        <br/>
        हे लक्षात घेऊनच आम्ही बनवलंय <span style={{color:"red"}}>एक्साम-वाला वेब ऍप </span> .
        <br/>
        आमची वेबसाइट नेहमीच्याच त्या कंटाळवाण्या टेस्ट सेरीजच्या पलीकडे जाऊन विद्यार्थ्यांना एक आकर्षक UI (User Interface) च्या मदतीने दिलेल्या टेस्ट सेरीजचा विश्लेषणात्मक अहवाल पुरवते. यातून 'मी नेमका कुठे कमी पडतो आहे ?' , 'मी आणखीन कोठे सुधारणा करायला हवी ?' इत्यादि प्रश्नांची उत्तरे विद्यार्थ्यांना चुटकीसरशी मिळतात. त्यामुळे विद्यार्थ्यांचे विश्लेषण करण्याचे कष्ट आणि वेळ दोन्हीही वाचतात. 
        </p>
        </div>
        </div>
    )

}

export default Home;