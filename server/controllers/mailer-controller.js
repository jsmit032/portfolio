config = require('./oauth2-config.js');
GoogleProvider = require('./google.js');

/**
 * User google oauth provider to call gmail api to send email.
 */
var token_holder = {
    access_token: config.access_token,
    token_type: config.token_type,
    expires_in: config.expires_in,
    refresh_token: config.refresh_token
};

email_message_1 = 'From: ' + config.user_name + ' <' + config.user_email + '>\nTo: <';
email_message_2 = '>\nSubject: Nice meet you\nDate: Fri, 21 Nov 1997 09:55:06 -0600\nMessage-ID: <1234@local.machine.example>\n\nThank you for your interest in my work! I am enclosing links to my websites, linkedin, and resume.\n\nIf you imputed your e-mail at the Meet and Hire event at General Assembly on Thursday night, it was a pleasure to meet with you! Please connect with me on linkedin and lets stay in touch!\n\nIf you happen to come across cross my portfolio, thank you for your interest as well! Please connect with me on linkedin as I would love to hear from you!\n\nIf you would like a hard copy of my resume, please send me an email and I will forward you a copy!\n\nThank You for your interest!\n\nLinkedIn: https://www.linkedin.com/in/smithjenniferl\nPortfolio: https://jennifer-louise.herokuapp.com/\nGitHub: https://github.com/jsmit032\n\n----\nJennifer L. Smith\nsmith.jennifer.louise@gmail.com\n(949)702-4621';

function sendMail (request, response) {

	var googleProvider = new GoogleProvider(config.client_id, config.client_secret, config.redirect_uri);
	
	email_to = request.body.subscribe_email;
	complete_email_message = email_message_1 + email_to + email_message_2;
               
    googleProvider.sendEmailAPI(token_holder, config.user_email, email_to, complete_email_message, function (err, status) {
        if (err) {
            console.log('failed: ' + err);
        } else {
            console.log('status: ' +  JSON.stringify(status));
        }
       	response.status(201).json({ message: 'email was sent to: ' + request.body.subscribe_email });

    });



}

module.exports = {
	sendMail: sendMail,
}