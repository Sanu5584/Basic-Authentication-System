// validations for password

// Minimum length (e.g., 6 chars) - Done✅
    // Maximum length (e.g., 16 chars) - Done✅
    // 	At least 1 uppercase letter - Done✅
    // At least 1 lowercase letter - Done✅
    // At least 1 number - Done✅
    // At least 1 special character (!@#$%^&* etc.)	- Done✅
    // No spaces allowed - Done✅
    // No repeating characters more than N times (optional)	
    // No sequences like 12345, abcde (advanced)	
    // No part of the username/email inside the password	
    // No common passwords like "password", "123456"	
    // Password should not be same as old password (if you're storing history)
    // Should not be only numbers or only letters - Done✅

    const hasUpperCase = function(str){
        for(let i = 0; i < str.length; i++){
            const char = str[i]
            if(char >= "A" && char <= "Z"){
                return true
            }
        }
        return false;
    }

    const hasLowerCase = function(str){
        for(let i = 0; i < str.length; i++){
            const char = str[i]
            if(char >= "a" && char <= "z"){
                return true;
            }
        }
        return false
    }

    const hasNumber = function(str){
        for(let i = 0; i < str.length; i++){
            const num = str[i]
            if(num >= "0" && num <= "9"){
                return true;
            }
        }
        return false
    }

    const hasSpecialCharacters = function(str){
        const specialChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/`~";
        for(let i = 0; i < str.length; i++){
            if(specialChars.includes(str[i])){
                return true
            }
        }
        return false
    }

    const hasWhiteSpaces = function(str){
        for(let i = 0; i < str.length; i++){
            let whiteSpace = " "
            if(str[i] === whiteSpace){
                return true
            }
        }
        return false
    }

export {hasLowerCase, hasUpperCase, hasNumber, hasSpecialCharacters, hasWhiteSpaces}