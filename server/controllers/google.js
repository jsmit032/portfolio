var
    util = require('util'),
    querystring = require('querystring'),
    request = require('request'),
    googleapi = require('googleapis'),
    OAuth2 = googleapi.auth.OAuth2,
    gmail = googleapi.gmail('v1');

function GoogleProvider(client_id, client_secret, redirect_uri) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
}

GoogleProvider.prototype.getAuthenticateURL = function (options) {
    return util.format('https://accounts.google.com/o/oauth2/auth?client_id=%s&redirect_uri=%s&response_type=%s&scope=%s',
        this.client_id,
        encodeURIComponent(this.redirect_uri),
        'code',
        encodeURIComponent('https://mail.google.com/')
        );
};

GoogleProvider.prototype.getAuthentication = function (options, callback) {
    console.log('options: ' + options.code);

    var
        that = this,
        params = {
            
            client_secret: this.client_secret,
            code: options.code,
            grant_type: 'authorization_code', 
            client_id: this.client_id, 
            redirect_uri: this.redirect_uri
          
        };
    request.post({
        //uri: 'http://echo.opera.com',
        uri: 'https://accounts.google.com/o/oauth2/token',
        form: params,
        headers: { 'Connection': 'close' },
        timeout: 5000 // 5 seconds
    }, function (err, res, body) {
        if (err) {
            return callback(err);
        }
        if (res.statusCode !== 200) {
            return callback(new Error('Bad response code: ' + res.statusCode));
        }
        console.log('>>> ' + body);
 //       var r = querystring.parse(body);

        var r = JSON.parse(body);

        console.log('access_token: ' + r.access_token);
        console.log('token_type: ' + r.token_type);
        console.log('expires_in: ' + r.expires_in + ' seconds');
        console.log('refresh_token: ' + r.refresh_token);

        callback(null, r);
     });
};

GoogleProvider.prototype.refreshToken = function (token_object, callback) {
    console.log('token_object: ' + JSON.stringify(token_object));

    var
        that = this,
        params = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            refresh_token: token_object.refresh_token,
            grant_type: 'refesh_token'          
        };
    request.post({
        uri: 'https://accounts.google.com/o/oauth2/token',
        form: params,
        headers: { 'Connection': 'close' },
        timeout: 5000 // 5 seconds
    }, function (err, res, body) {
        if (err) {
            return callback(err);
        }
        if (res.statusCode !== 200) {
            return callback(new Error('Bad response code: ' + res.statusCode));
        }
        console.log('>>> ' + body);

        var r = JSON.parse(body);

        console.log('access_token: ' + r.access_token);
        console.log('token_type: ' + r.token_type);
        console.log('expires_in: ' + r.expires_in + ' seconds');
        console.log('refresh_token: ' + r.refresh_token);

        callback(null, r);
     });
};

GoogleProvider.prototype.requestAPI = function (method, apiName, access_object, options, callback) {
    options = options || {};
    var opts = {
        method: method,
        uri: 'https://accounts.google.com/' + apiName,
        timeout: 5000
    };
    if (method === 'GET') {
        opts.qs = options;
    }
    if (method === 'POST') {
        opts.form = options;
    }
    request(opts, function (err, res, body) {
        if (err) {
            return callback(err);
        }
        if (res.statusCode !== 200) {
            return callback(new Error('Bad response code: ' + res.statusCode));
        }
        var r;
        try {
            r = JSON.parse(body);
        } catch (e) {
            return callback(e);
        }
        if (r.error) {
            return callback(new Error(r.error.message));
        }
        callback(null, r);
    });
};

GoogleProvider.prototype.sendEmailAPI = function (token_object, email_from, email_to, email_message, callback) {
    var oauth2Client = new OAuth2(this.client_id, this.client_secret, this.redirect_uri);

    // Retrieve tokens via token exchange explained above or set them:
    oauth2Client.setCredentials({
      access_token: token_object.access_token,
      refresh_token: token_object.refresh_token
    });

    var params = {
        userId: 'me',
        auth: oauth2Client,
        media: {
            mimeType: 'message/rfc822',
            body: email_message.toString('base64')
        }
    };

    gmail.users.messages.send(params, function(err, response) {
        // handle err and response
        if(err) {
            callback(err);
        } else {
            callback(null, response);
        }

    });

};
GoogleProvider.prototype.getProfile = function (token_object, callback) {
    var oauth2Client = new OAuth2(this.client_id, this.client_secret, this.redirect_uri);

    // Retrieve tokens via token exchange explained above or set them:
    oauth2Client.setCredentials({
      access_token: token_object.access_token,
      refresh_token: token_object.refresh_token
    });

    var params = {
        userId: 'me',
        auth: oauth2Client,       
    };

    gmail.users.getProfile(params, function(err, response) {
        // handle err and response
        if(err) {
            callback(err);
        } else {
            console.log(JSON.stringify(response));

            callback(null, response);
        }

    });

};

GoogleProvider.prototype.sendEmail = function (token_object, email_from, email_to, email_message, callback) {

    var generator = require('xoauth2').createXOAuth2Generator({
        user: this.email_from,
        clientId: this.client_secret,
        clientSecret: this.client_secret,
        refreshToken: token_object.refresh_token
    });

    // listen for token updates
    // you probably want to store these to a db
    generator.on('token', function(token){
        console.log('New token for %s: %s', token.user, token.accessToken);
    });

    var auth_string = ''; //user=%s\1auth=Bearer %s\1\1', user, token_object.access_token;

    smtp_options = {
        host: 'smtp.gmail.com',
        port: 587,
        requireTLS: true,
        authMethod: 'XOAUTH2',
        tls: { 'XOAUTH2': auth_string.toString('base64') },
        debug: true
    };

    var connection = new SMTPConnection(smtp_options);

    connection.on('log', function(data) { console.log('LOG: ' + JSON.stringify(data)); });

    connection.connect(function (err) {
        if(err) {
            callback('smtp-connection error: ' + err);
        } else {
            console.log('*** CONNECTED ***');
        }
    })

    // login
    connection.on('connect', function(err) {
        if(err) {
            callback(err);
        }
        console.log('*** ON: CONNECTED ***');

        connection.login({
            xoauth2: generator
        }, function(err) {
            if(err) {
                callback(err);
            } else {

                console.log('*** VERIFIED ***');

                var envelope = {
                    from: email_from,
                    to: email_to
                }
                connection.send(envelope, email_message, function(err, info) {
                    if(err) {
                        callback(err);
                    } else {
                        connection.quit();
                        callback(null, info);
                    }
                });
            }
        });
    });
};


module.exports = GoogleProvider;
