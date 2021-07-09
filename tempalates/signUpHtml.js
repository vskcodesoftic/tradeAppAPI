
 const signupHTML = (name, otp, email) => `
<h2>Hi, ${name} </h2>
<h3>Your verification OTP is ${otp}</h3>
<a href="http://localhost:8001/api/user/emailVerify/?otpId=${otp}&emailId=${email}">click for verfication</a>
`;
 const forgetHTML = (name, otp) => `
<h2>Hi, ${name} </h2>
<h3>Your verification OTP is ${otp} to change your password</h3>
`;
const addAdminMail = (name, otp, password) => `
<h2>Hi, ${name} </h2>
<h3>Your verification OTP is ${otp}</h3>
<h3>& Your Password is ${password}, Please reset your password after logging in</h3>
<br />

`;

//logi ttemp
const loginMailHTML = (otp, email) => `
<h3>Your verification OTP is ${otp} </h3>
<a href="http://localhost:8001/api/user/emailVerify/?otpId=${otp}&emailId=${email}">click for verfication</a>

`;

exports.signupHTML = signupHTML ;
exports.forgetHTML = forgetHTML ;
exports.addAdminMail = addAdminMail ;
exports.loginMailHTML = loginMailHTML;