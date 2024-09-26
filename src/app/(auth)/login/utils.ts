interface loginInfo{
    loginId:string
    password:string
}

const sendLoginRequest = async (loginInfo: loginInfo) => {
    console.log(loginInfo);
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        })

        if (!response.ok) throw Error('비정상 동작')

        const data = await response.json();
        console.log(data)
        const accessToken = await data.accessToken;
        const refreshToken = await data.refreshToken;

        // 토큰을 로컬 스토리지에 저장 (또는 쿠키에 저장)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return true;
    } catch (e) {
        console.error(e);

        return false;
    }
}

export default sendLoginRequest;