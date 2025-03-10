import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import Logo from "../components/Images/Logo.jpg";

const whatsappButton = () => {
  return (
    <div className="z-50 overflow-hidden fixed rounded-full block bottom-4 right-4">
      <FloatingWhatsApp
        phoneNumber="+61426377641"
        accountName="Amandas Wear"
        allowClickAway
        notification={true}
        chatMessage="Hello there! What Luxury Item are you odering today 🤝? Chat with us on WhatsApp. Amandas Wear we are at your service."
        avatar={Logo} 
        style={{ zIndex: 1000000 }}
      />
    </div>
  );
};

export default whatsappButton;
