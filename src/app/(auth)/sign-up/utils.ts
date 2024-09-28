const sendSignUpRequest = async (userInfo: FormData) => {
    try {
        const response = await fetch('sign-up/api', {
            method: 'POST',
            body: userInfo
        })

        if (!response.ok) throw Error('비정상 동작')
        
        console.log(response.json)
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

export default sendSignUpRequest;