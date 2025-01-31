import NavBar from "../../components/NavBar";
import Comment from "../../components/Comment"; // Reuse the Comment component

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NavBar />
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Contact Us
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Have questions, suggestions, or feedback? Leave us a message, and we’ll get back to you as soon as possible!
        </p>
        <Comment />
      </div>
    </div>
  );
};

export default ContactPage;
