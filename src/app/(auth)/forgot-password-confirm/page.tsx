
const ForgotPasswordConfirmationPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Check Your Email
        </h2>
        <p className="text-gray-600 mb-4">
          We’ve sent an email to the address you provided. Please check your email and follow the instructions to reset your password.
        </p>
        <p className="text-gray-600">
          If you don’t see the email in your inbox, please check your spam or junk folder.
        </p>

        <a
          href="/"
          className="mt-6 inline-block px-4 py-2 bg-[#5051F9] text-white rounded-md hover:bg-[#4747e0]"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordConfirmationPage;
