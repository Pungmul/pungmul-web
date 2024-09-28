const sendSignUpRequest = async (userInfo: FormData) => {
    try {
        const response = await fetch('sign-up/api', {
            method: 'POST',
            body: userInfo
        })

        if (!response.ok) throw Error('비정상 동작')
        
        console.log(response.json)
    } catch (e) {
        console.error(e);
    }
}

export default sendSignUpRequest;