export function validEmailAddress(emailAddress) {
    // The below reged will test if an emaill address is valid
    // what constitutes a valid email address: name@provider.domainname
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/im;
    return emailRegex.test(emailAddress);
}
