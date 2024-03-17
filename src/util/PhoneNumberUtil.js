export function validPhoneNumber(phoneNumber) {
    // The below regex verifies the users phone number
    /**
     * Below are the accepted formats
     *   (123) 456-7890
     *   (123)456-7890
     *   123-456-7890
     *   123.456.7890
     *   1234567890
     *   +11234567890
     */
    const phoneNumberRegEx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneNumberRegEx.test(phoneNumber);
}

export function formatPhoneNumber(phoneNumber) {
    // Here we take whatever the user has placed in the phone number field and cleaned it
    // so we just have the number only. I.e. 123.456.7890 becomes 1234567890
    const phoneNumberDigitsOnly = phoneNumber.replace(/\D/g, "");
    //Since we accept country codes, we also want to format this correctly
    if (phoneNumberDigitsOnly.length > 10) {
        // We then use regex again to format +11234567890 to +1-123-456-7890
        return phoneNumberDigitsOnly.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1-$2-$3-$4");
    } else {
        // We then use regex again to format 1234567890 to 123-456-7890
        return phoneNumberDigitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
}
