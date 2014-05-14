var auth = (function() {
    var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
    var SCOPE       =   'https://www.googleapis.com/auth/userinfo.email';
    var CLIENTID    =   '261400483913-shcn6na10pg5ptr5qmgvois5hcsmnc4d.apps.googleusercontent.com';
    var HD          =   'app2technologies.com';//hosted domain

    function login(config, callback) {

        gapi.auth.authorize(config, function() {

            var token = gapi.auth.getToken();
            token = token.access_token;
            validateToken(token, callback);

        });

        function validateToken(token, callback) {
            $.ajax({
                url: VALIDURL + token,
                data: null,
                success: function(responseText){  
                    getUserInfo(token, callback);
                },  
                dataType: "jsonp"
            });
        }// end of validateToken..

        function getUserInfo(token, callback) {
            $.ajax({
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token,
                data: null,
                success: function(user) {

                    var email = user.email.split('@');
                    email = email[email.length-1];

                    if(email == HD) {
                        callback();//if valid user show visulization....
                    }
                },
                dataType: "jsonp"
            });
        }//end of getUserInfo..

    }//end of login...


    return function(callback) {
        var sessionParams = {
            'client_id': CLIENTID,
            'session_state': null
        }

        var apiLoadTimer = setInterval(function() { // Workaround for gapi.auth object [ till it loads ].. 
            
            if(gapi.auth) {
                clearInterval(apiLoadTimer);

                gapi.auth.checkSessionState(sessionParams, function(userNotLoggedIn) {
                    var config = {
                        'client_id': CLIENTID,
                        'scope': SCOPE,
                        'hd': HD
                    };

                    if(!userNotLoggedIn) {
                        // already logged in, don't show popup
                        config.immediate = true;
                    }

                    login(config, callback);
                
                });//gupi.auth.checkSessionState...
            }
        }, 100);//set Interval
    }
})();
