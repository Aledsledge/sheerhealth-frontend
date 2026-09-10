import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuthValue } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const { currentUser } = useAuthValue();
  const [time, setTime] = useState(60);
  const { timeActive, setTimeActive } = useAuthValue();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      currentUser?.reload()
        .then(() => {
          if (currentUser?.emailVerified) {
            clearInterval(interval);
            navigate('/');
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    }, 1000);
  }, [navigate, currentUser]);

  useEffect(() => {
    let interval = null;
    if (timeActive && time !== 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setTimeActive(false);
      setTime(60);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeActive, time, setTimeActive]);

  const resendEmailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setTimeActive(true);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Verify your Email Address</h1>
        <p>
          <strong>A Verification email has been sent to:</strong>
          <br />
          <span className="font-medium">{currentUser?.email}</span>
        </p>
        <p className="mt-2">Follow the instructions in the email to verify your account.</p>
        <button
          className={`btn-primary ${
            timeActive ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''
          }`}
          onClick={resendEmailVerification}
          disabled={timeActive}
        >
          {timeActive ? `Resend Email (${time})` : 'Resend Email'}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
