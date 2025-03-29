import { Link } from "react-router-dom";
import "../../css/footer.css"
import contactDetails from "../../other/contactDetails";
function Footer(){
    

return (
<div className="col-md-12 mt-4 p-4 footerDiv">
<p>
<span style={{fontSize:"1.4em"}}>संपर्क : </span>
<br/> 
<i class="bi bi-phone-fill"></i> मोबाइल क्रमांक : {contactDetails.mobile} <br/> 
<i class="bi bi-envelope-at-fill"></i> ई-मेल :   {contactDetails.email} <br/>
</p>
</div>
)

}

export default Footer;