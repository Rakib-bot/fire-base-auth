import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';
import './App.css';
//import "firebase/auth";
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, FacebookAuthProvider  } from "firebase/auth";
import PasswordError from './Components/PasswordError/PasswordError';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function App() {

  const provider = new GoogleAuthProvider();
  const fbProvider =new FacebookAuthProvider();

  const [check, setCheck] = useState({
    emailValid: false,
    passwordValid: false
  })
  const [newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
  })
  const [status, setStatus] = useState('');
  const [color, setColor] = useState('');
  const [isSignedUp,setIsSignedUp] = useState(false);
  

  const handleSignIn = () => {
    if (!auth.currentUser) {
      signInWithPopup(auth, provider)
        .then((result) => {
          const { displayName, email, photoURL } = result.user;
          const signedInUser = {
            isSignedIn: true,
            name: displayName,
            email: email,
            photo: photoURL
          }
          setUser(signedInUser);
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });

    }
    else {
      console.log("Already Logged In");
      const signedInUser = {
        isSignedIn: true,
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photo: auth.currentUser.photoURL
      }
      setUser(signedInUser)


    }

  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(signedOutUser);

    })
      .catch(err => {
        console.log(err.message);

      })
  }

  const handleOnBlur = (e) => {
    let check = true;
    if (e.target.name === 'password') {
      let passwordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(e.target.value);
      setCheck((preState) => {
        return { ...preState, passwordValid }
      })
      check = passwordValid;
    }
    if (e.target.name === 'email') {
      let emailCheck = /\S+@\S+\.\S+/.test(e.target.value)
      // console.log(check);
      setCheck((preState) => {
        return { ...preState, emailValid: emailCheck }
      })
      check = emailCheck;
    }
    if (check) {
      const newUpdate = { ...user };
      newUpdate[e.target.name] = e.target.value;
      setUser(newUpdate);
    }
  }
  const handleFrom = (e) => {

    if (newUser && user.email && user.password) {
      console.log(user.email, user.password)
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed up 
          
          setStatus('Sign up Succesfully')
       
          setIsSignedUp(true)
          updateName(user.name);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setStatus(errorMessage)
       
          setIsSignedUp(false)
          // ..
        });

    }
    if(!newUser && user.email && user.password) {
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          // Signed in 
          
          setStatus('Logged in Succesfully')
          
          console.log(res.user)
          setIsSignedUp(true)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setStatus(errorMessage)
       
          setIsSignedUp(false)
        });

    }
    e.preventDefault();
  }
  const updateName = (name) =>{

    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      // Profile updated!
      // ...
      console.log('user name updated')
    }).catch((error) => {
      // An error occurred
      // ...
      console.log(error)
    });
  }
 const handleFbSignIn =()=>{

  signInWithPopup(auth, fbProvider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;
    console.log(user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
 }

  return (
    <div className='App' >
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>
      }
      <br />
      <button onClick={handleFbSignIn}>Sign in using Facebook</button>

      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.password}</p>
      <h1>Our Authentic System</h1>
      <form onSubmit={handleFrom}>
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />

        <label htmlFor="newUser">New User Sign Up</label>
        <br />
        {newUser && <input type="text" name="name" id="" onBlur={handleOnBlur} required placeholder='Your name' />}
        <br />
        <input type="email" name="email" onBlur={handleOnBlur} id="" required placeholder='Your email' />
        <br />
        <input type="password" name="password" onBlur={handleOnBlur} id="" required placeholder='Your password' />
        <br />
        <input type="submit" value={newUser?'Sign UP':'Login'} name="submit"></input>
      </form>
      {
        isSignedUp ? <p style={{ color: 'green' }}>{status}</p>:<p style={{ color: 'red' }}>{status}</p>
      }
      {
        !check.passwordValid && <PasswordError />

      }
      {
        !check.emailValid && <p>Email is not valid</p>
      }

    </div>
  );
}

export default App;
