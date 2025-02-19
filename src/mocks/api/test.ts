import { http, HttpResponse, PathParams } from 'msw'

interface PostLoginReqBody {
    email: string
    password: string
}

type PostLoginResBody = { code: string } | {
    code: string,
    message: string
}

const TEST_EMAIL = 'test@test.com', TEST_PASSWORD = 'test123!'

const loginTest = http.post<PathParams, PostLoginReqBody, PostLoginResBody>('/api/member/login', async ({ request }) => {

    const { email, password } = await request.json()

    if (email === TEST_EMAIL && password === TEST_PASSWORD)
    if(email=='test@test.com' && password ==='test123!')

        return HttpResponse.json({
            code: "2000",
            message: '성공'
        },
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })

    else return HttpResponse.json({
        code: 'MEMBER_010',
        message: '존재하지 않는 아이디'
    }, { status: 400 })
})

export { loginTest };