import React from 'react';

const PasswordError = () => {
    return (<div> <p>At least 6 characters long</p>
        <p>Contains at least one special character</p>
        <p>Contains at least one number</p>
        <p>Contains at least one alphabet letter</p> </div>);
};

export default PasswordError;