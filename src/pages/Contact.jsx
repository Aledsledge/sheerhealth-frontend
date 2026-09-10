import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { name, email, subject, message } = state;

  const sendEmail = (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      toast.error("Please provide a value in each input field");
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      subject,
      message,
    };

    emailjs
      .send(
        "service_m4693a8",
        "te23_pureUsers",
        templateParams,
        "rGyJqdkYGKE7Z2QDt"
      )
      .then((result) => {
        console.log(result.text);
        setState({ name: "", email: "", subject: "", message: "" });
        toast.success("Form submitted successfully");
      })
      .catch((error) => {
        console.log(error.text);
        toast.error("An error occurred while submitting the form");
      });
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <section className="contact-section">
      <div className="container mx-auto">
        <ToastContainer position="top-center" />
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
          <h3 className="mb-4 text-2xl font-bold text-center">Send us a message</h3>
          <form
            id="contactForm"
            className="contact-form"
            onSubmit={sendEmail}
          >
            <div className="mb-4">
              <input
                type="text"
                className="form-input"
                name="name"
                placeholder="Name"
                onChange={handleInputChange}
                value={name}
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                className="form-input"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                value={email}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="form-input"
                name="subject"
                placeholder="Subject"
                onChange={handleInputChange}
                value={subject}
              />
            </div>
            <div className="mb-4">
              <textarea
                className="form-input"
                name="message"
                placeholder="Message"
                cols="20"
                rows="6"
                onChange={handleInputChange}
                value={message}
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn-primary"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
