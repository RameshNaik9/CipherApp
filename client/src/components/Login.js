// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Combine the imports for cleaner code
// import './Login.css';
// import axios from 'axios';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // Move useNavigate inside the component

//   const handleUsernameChange = (e) => {
//     setUsername(e.target.value);
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (username.trim() === '' || password.trim() === '') {
//       alert('Please provide both username and password.');
//       return;
//     }

//     axios.post('http://localhost:5000/login', { username, password })
//       .then((response) => {
//         if (response.data.authenticated) {
//           console.log('User authenticated!');
//           navigate('/home'); // Using navigate to redirect
//         } else {
//           alert('Invalid username or password. Please try again.');
//         }
//       })
//       .catch((error) => {
//         console.error('Error logging in:', error);
//         alert('Login failed.');
//       });
//   };

//   return (
//     <div>
//       <header className="app-header"><h1>Cipher App</h1></header>
//       <div className="login-form">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="username">Username:</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={username}
//               onChange={handleUsernameChange}
//               required
//               autoComplete="username"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={handlePasswordChange}
//               required
//               autoComplete="current-password"
//             />
//           </div>
//           <button type="submit">Submit</button>
//           <div className="signup-link">
//             <p>Don't have an Account ? <Link to="/signup" className="button-link">Sign up</Link></p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      alert('Please provide both username and password.');
      return;
    }

    axios.post('http://localhost:5000/login', { username, password })
      .then((response) => {
        if (response.data.authenticated) {
          console.log('User authenticated!');
          navigate('/home'); // Redirect to home page for normal user
        } else {
          alert('Invalid username or password. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        alert('Login failed.');
      });
  };

  // Function to handle admin login redirection
  const handleAdminLogin = () => {
    navigate('/admin-login'); // Redirect to admin login page
  };

  return (
    <div>
      <header className="app-header"><h1>Cipher App</h1></header>
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={handleAdminLogin}>Admin Login</button> {/* Admin login button */}
          <div className="signup-link">
            <p>Don't have an Account ? <Link to="/signup" className="button-link">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
