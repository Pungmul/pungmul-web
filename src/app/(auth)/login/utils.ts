interface loginInfo {
    loginId: string
    password: string
}

const sendLoginRequest = async (loginInfo: loginInfo) => {
    console.log(loginInfo);
    try {
        const response = await fetch('login/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        })

        if (!response.ok) throw Error('비정상 동작')

        return true;
    } catch (e) {
        console.error(e);

        return false;
    }
}

export default sendLoginRequest;