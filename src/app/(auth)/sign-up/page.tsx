'use client'

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import sendSignUpRequest from "./utils";

import Image from "next/image";
import checkMark from '@public/checkMark.svg';
import ChevronRightIcon from '@public/Chevron-right-icon.svg'

import WarningCircleIcon from '@public/Warning-circle-icon.svg'

import { Header } from "@pThunder/component/shared/Header";
import { debounce } from "lodash";
import useSignupStore from "./sign-up.store";

export default function SignUpPage() {

    const router = useRouter();

    const currentSignUpStep = useSignupStore((state) => state.currentStep);
    const setCurrentStep = useSignupStore((state) => state.setCurrentStep);


    const canNextStep = useSignupStore((state) => state.canNextStep);
    const setCanNextStep = useSignupStore((state) => state.setCanNextStep);

    const sendSignUpRequest = useSignupStore((state) => state.sendSignUpRequest);

    useEffect(() => {
        setCurrentStep('약관동의')
    }, [])



    const stepRender = () => {
        switch (currentSignUpStep) {
            case '약관동의':
                return <약관동의 />
            case '계정정보입력':
                return <계정정보입력 />
            case '개인정보입력':
                return <개인정보입력 />
        }
    }

    return (
        <div className="h-full w-full flex flex-col justifyd-center">
            <Header title="회원가입" />
            <div className="flex flex-col flex-grow flex-shrink-0">
                <StepReveal />
                {
                    stepRender()
                }
                <div className="w-full py-4"
                    style={{ padding: '12px 36px' }}>
                    <div className="w-full flex items-center justify-center text-white rounded"
                        style={{ height: 48, backgroundColor: canNextStep ? '#816DFF' : '#e2deff', cursor: canNextStep ? 'pointer' : 'not-allowed' }}
                        onClick={() => {
                            if (canNextStep) {
                                switch (currentSignUpStep) {
                                    case '약관동의':
                                        setCurrentStep("계정정보입력");
                                        return;
                                    case '계정정보입력':
                                        setCurrentStep("개인정보입력");
                                        return;
                                    case '개인정보입력':
                                        sendSignUpRequest();

                                        router.push('/auth/sign-in');
                                        return;
                                }
                                setCanNextStep(false)
                            }
                        }}>
                        {currentSignUpStep != '개인정보입력' ? `다음` : '회원 가입 하기'}
                    </div>
                </div>
            </div>
        </div>
    )
}

const StepReveal = () => {

    const currentSignUpStep = useSignupStore((state) => state.currentStep);
    return (
        <div className="flex flex-row items-center" style={{ margin: '28px auto', padding: '0 12px', paddingTop: 4 }}>
            <div className="flex flex-col items-center overflow-visible" style={{ gap: 8, width: 48 }}>
                <div className={`flex items-center justify-center ${currentSignUpStep == "약관동의" ? ' bg-[#816DFF]' : ' bg-[#D9D9D9]'}  rounded-full`} style={{ height: 36, width: 36 }}>
                    <div className="text-white">1</div>
                </div>
                <div style={{ fontSize: 14, textAlign: 'center', color: currentSignUpStep == "약관동의" ? '#816DFF' : '#D9D9D9', lineHeight: '110%', width: 100 }}>
                    약관동의
                </div>
            </div>
            <div className="border-dashed border border-[#D9D9D9]" style={{ width: 65, marginBottom: 28 }} />

            <div className="flex flex-col items-center overflow-visible" style={{ gap: 8, width: 48 }}>
                <div className={`flex items-center justify-center ${currentSignUpStep == "계정정보입력" ? ' bg-[#816DFF]' : ' bg-[#D9D9D9]'}  rounded-full`} style={{ height: 36, width: 36 }}>
                    <div className="text-white">2</div>
                </div>
                <div style={{ fontSize: 14, textAlign: 'center', color: currentSignUpStep == "계정정보입력" ? '#816DFF' : '#D9D9D9', lineHeight: '110%', width: 100 }}>
                    계정 정보 입력
                </div>
            </div>

            <div className="border-dashed border border-[#D9D9D9]" style={{ width: 65, marginBottom: 28 }} />

            <div className="flex flex-col items-center overflow-visible" style={{ gap: 8, width: 48 }}>
                <div className={`flex items-center justify-center ${currentSignUpStep == "개인정보입력" ? ' bg-[#816DFF]' : ' bg-[#D9D9D9]'}  rounded-full`} style={{ height: 36, width: 36 }}>
                    <div className="text-white">3</div>
                </div>
                <div style={{ fontSize: 14, textAlign: 'center', color: currentSignUpStep == "개인정보입력" ? '#816DFF' : '#D9D9D9', lineHeight: '110%', width: 100 }}>
                    프로필 입력
                </div>
            </div>
        </div>
    )
}

const 개인정보입력 = () => {


    const setCanNextStep = useSignupStore((state) => state.setCanNextStep);

    const [onClubSelect, setClubSelectState] = useState(false)

    const [name, setName] = useState('');
    const [nameValidation, setNameValidation] = useState<ValidationState>({ status: "before" })

    const [nickname, setNickname] = useState('');
    const [nicknameValidation, setNicknameValidation] = useState<ValidationState>({ status: "confirm" })

    const [club, setClub] = useState<{ clubId: number, school: string, clubName: string } | null | undefined>(undefined)
    const [clubValidation, setClubValidation] = useState<ValidationState>({ status: "before" })

    const [tellNumber, setTellNumber] = useState<string | undefined>(undefined)
    const [tellNumberValidation, setTellNumberValidation] = useState<ValidationState>({ status: "confirm" })

    const handleNicknameBlur = (e: React.FocusEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const koreanRegex = /^[가-힣]+$/;

        if (value === "" || koreanRegex.test(value)) {
            setNickname(value);
            setNicknameValidation({ status: 'confirm' });
        } else {
            setNameValidation({ status: 'error', errorText: '올바른 형식의 한글 패명을 입력하세요.' });
        }
    };

    const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {

        const value = e.target.value;
        if (value == "") {
            setNameValidation({ status: 'error', errorText: '이름을 입력해주세요.' });
            return;
        }

        const koreanRegex = /^[가-힣]+$/;

        if (koreanRegex.test(value)) {
            setName(value);
            setNameValidation({ status: 'confirm' });
        } else {
            setNameValidation({ status: 'error', errorText: '올바른 형식의 한글 이름을 입력하세요.' });
        }
    };

    const formatPhoneNumber = (value: string): string => {
        const numericValue = value.replace(/\D/g, "");

        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 7) return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        if (numericValue.length <= 10) return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        if (numericValue.length <= 11) return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
        return `${numericValue.slice(0, 11)}`;
    };

    const handleTellNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.currentTarget.value.replace(/[^0-9]/g, "");
        e.currentTarget.value = formatPhoneNumber(numericValue);
    };

    const handleTellNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const telNumberRegex = /^(01[0-9]-?\d{3,4}-?\d{4}|0\d{2,3}-?\d{3,4}-?\d{4})$/;

        if (value === "" || telNumberRegex.test(value)) {
            setTellNumber(value);
            setTellNumberValidation({ status: 'confirm' });
        } else {
            setTellNumberValidation({ status: 'error', errorText: '올바른 형식의 전화번호를를 입력하세요.' });
        }
    };


    useEffect(() => {
        const notConfirmValidation = [nameValidation, nicknameValidation, clubValidation, tellNumberValidation].filter((value) => (value.status != 'confirm'));
        if (notConfirmValidation.length > 0)
            setCanNextStep(false)
        else
            setCanNextStep(true);

    },
        [nameValidation, nicknameValidation, clubValidation, tellNumberValidation])

    return (
        <div className="flex flex-col flex-grow overflow-y-auto" style={{ gap: 20 }}>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="flex flex-row">
                        <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>이름</div>
                        <div className="text-red-500" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>*</div>
                    </div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="text" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="이름을 입력해주세요." style={{ padding: '' }}
                            onFocus={() => setNameValidation({ status: 'pending' })}
                            onBlur={handleNameBlur} />
                    </div>
                    {nameValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{nameValidation.errorText}</div>
                    </div>}
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>패명</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="text" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="패명을 입력해주세요." style={{ padding: '' }}
                            onFocus={() => setNicknameValidation({ status: 'pending' })}
                            onBlur={handleNicknameBlur} />
                    </div>
                    {nicknameValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{nicknameValidation.errorText}</div>
                    </div>}
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="flex flex-row">
                        <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>동아리</div>
                        <div className="text-red-500" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>*</div>
                    </div>
                    <div className="flex flex-row items-center border justify-between border-[#CDC5FF] cursor-pointer" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}
                        onClick={() => {
                            if (clubValidation.status != 'pending')
                                setClubValidation({ status: 'pending' });
                            else if (club === undefined)
                                setClubValidation({ status: 'error', errorText: '클럽을 선택해주세요' })
                            else {
                                setClubValidation({ status: "confirm" })
                            }
                        }}>
                        <div className={`flex-grow ${club === undefined ? 'text-[#CDC5FF]' : 'text-[#816DFF] '}`} style={{ padding: '' }} >
                            {club === undefined ? '동아리를 선택해주세요.' : club ? `${club.school}-${club.clubName}` : '동아리 없음'}
                        </div>
                        {/* <Image src={WarningCircleIcon} width={12} alt="" /> */}
                    </div>
                    {clubValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{clubValidation.errorText}</div>
                    </div>}
                </div>
                {clubValidation.status == 'pending' && <div className="w-full relative" style={{ marginTop: 6 }}>
                    <div className="absolute w-full bg-white border overflow-y-auto" style={{ height: 180, borderRadius: 5, scrollbarWidth: 'thin' }}>
                        <div className="flex flex-col w-full">
                            <div className="w-full flex-shrink-0 bg-[#F4F2FF] sticky top-0" style={{ padding: '6px 12px' }}>
                                <div className="bg-white flex flex-row items-center justify-between" style={{ padding: '4px 6px', gap: 4, borderRadius: 2.5 }}>
                                    <input type="text" placeholder="검색" className="flex-grow outline-none" />
                                    <Image src={WarningCircleIcon} width={12} alt="" />
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow" style={{ gap: 8, padding: '8px' }}>
                                <div key={'no-club'}
                                    className={`w-full ${club === null ? 'text-[#816DFF] font-semibold' : 'text-[#CDC5FF]'}  cursor-pointer`}
                                    style={{ padding: '4px' }}
                                    onClick={() => {
                                        setClubSelectState(false);
                                        setClub(null)
                                        setClubValidation({ status: 'confirm' })
                                    }}
                                >동아리 없음
                                </div>
                                {Array.from({ length: 8 }).map((_, index) =>
                                    <div key={index + 'club'}
                                        className={`w-full ${club?.clubId == index ? 'text-[#816DFF] font-semibold' : 'text-[#CDC5FF]'}  cursor-pointer`}
                                        style={{ padding: '4px' }}
                                        onClick={() => {
                                            setClubSelectState(false);
                                            setClub({ clubId: index, school: '실험', clubName: (index + 1) + '번 동아리' })
                                            setClubValidation({ status: 'confirm' })
                                        }}
                                    >{'실험-' + (index + 1) + '번 동아리'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>전화번호</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="tel" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]"
                            placeholder="전화번호를 입력해주세요."
                            onFocus={() => setTellNumberValidation({ status: 'pending' })}
                            onChange={handleTellNumberChange}
                            onBlur={handleTellNumberBlur} />
                    </div>
                    {tellNumberValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{tellNumberValidation.errorText}</div>
                    </div>}
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>초대코드</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="text" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]"
                            placeholder="초대코드를 입력해주세요."
                            onFocus={() => setTellNumberValidation({ status: 'pending' })}
                            onChange={handleTellNumberChange}
                            onBlur={handleTellNumberBlur} />
                    </div>
                    {tellNumberValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{tellNumberValidation.errorText}</div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

type ValidationStatus = "before" | "pending" | "confirm" | "error";

type ValidationState =
    | { status: "error"; errorText: string } // "error"일 때만 errorText 포함
    | { status: Exclude<ValidationStatus, "error"> }; // 다른 상태일 때 errorText 없음

const 계정정보입력 = () => {


    const setCanNextStep = useSignupStore((state) => state.setCanNextStep);

    const [email, setEmail] = useState('')
    const [emailValidation, setEmailValidation] = useState<ValidationState>({ status: 'before' });

    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState<ValidationState>({ status: 'before' });

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState<ValidationState>({ status: 'before' });

    const debounceCheckEmailValidation = useCallback(
        debounce((newValue: string) => checkEmailValidation(newValue), 500),
        []
    );

    const checkEmailValidation = (newValue: string) => {
        const EmailRegEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const EmailFormmatvalidation = EmailRegEx.test(newValue)
        if (!EmailFormmatvalidation)
            setEmailValidation({ status: 'error', errorText: '이메일 형식이 올바르지 않습니다.' });
        else {
            //여기에 이메일 중복 확인 로직 처리
            setEmailValidation({ status: 'confirm' })
        }
    }


    const checkPasswordValidation = (newValue: string) => {

        if (newValue.length < 8 || newValue.length > 12) {
            setPasswordValidation({ status: 'error', errorText: '비밀번호는 8~12자로 이루어져야합니다.' });
        } else {
            const passwordRegEx = /[A-Za-z\d!@#$%^&*]{8,12}$/;
            const passwordValidation = passwordRegEx.test(newValue)
            if (!passwordValidation)
                setPasswordValidation({ status: 'error', errorText: '특수 문자는 (!, @, #, $, %, ^, &, *)만 가능합니다.' });
            else {
                //여기에 이메일 중복 확인 로직 처리
                setPasswordValidation({ status: 'confirm' })
            }
        }
        console.log(newValue, confirmPassword, newValue != confirmPassword)
        if (newValue != confirmPassword)
            setConfirmPasswordValidation({ status: 'error', errorText: '비밀번호가 일치하지 않습니다.' });
        else {
            setConfirmPasswordValidation({ status: 'confirm' })
        }

    }

    const checkConfirmPasswordValidation = (newValue: string) => {
        console.log(password, newValue, password != newValue)
        if (newValue != password)
            setConfirmPasswordValidation({ status: 'error', errorText: '비밀번호가 일치하지 않습니다.' });
        else {
            setConfirmPasswordValidation({ status: 'confirm' })
        }

    }


    useEffect(() => {
        debounceCheckEmailValidation(email)
    }, [email])



    useEffect(() => {
        const notConfirmValidation = [emailValidation, passwordValidation, confirmPasswordValidation].filter((value) => (value.status != 'confirm'));
        if (notConfirmValidation.length > 0)
            setCanNextStep(false)
        else
            setCanNextStep(true);
    }, [emailValidation, passwordValidation, confirmPasswordValidation])

    return (
        <div className="flex flex-col flex-grow overflow-y-auto" style={{ gap: 20 }}>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>ID</div>
                    <div className={`flex flex-row items-center border ${emailValidation.status == 'error' ? 'border-red-500 border-2' : emailValidation.status == 'before' ? 'border-[#CDC5FF]' : 'border-[#816DFF] border'}`}
                        style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="email"
                            className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]"
                            placeholder="ID를 입력해주세요." style={{ padding: '' }}
                            value={email}
                            onChange={e => {
                                setEmailValidation({ status: 'pending' })
                                const newValue = e.currentTarget.value;
                                setEmail(newValue);
                            }}
                        />
                    </div>
                    {emailValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{emailValidation.errorText}</div>
                    </div>}
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>비밀번호</div>
                    <div className={`flex flex-row items-center border ${passwordValidation.status == 'error' ? 'border-red-500 border-2' : passwordValidation.status == 'before' ? 'border-[#CDC5FF]' : 'border-[#816DFF] border'}`}
                        style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type={passwordVisible ? "text" : "password"} id="password" name="password"
                            className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="비밀번호를 입력해주세요." style={{ padding: '' }}
                            onFocus={() =>
                                setPasswordValidation({ status: 'pending' })
                            }
                            onBlur={e => {
                                const newValue = e.currentTarget.value;
                                setPassword(newValue)
                                checkPasswordValidation(newValue);
                            }} />
                        <div className={`w-4 h-4 ${passwordVisible ? 'border bg-white' : 'bg-black'} rounded-md cursor-pointer`} onClick={() => setPasswordVisible(!passwordVisible)} />
                    </div>
                    {passwordValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{passwordValidation.errorText}</div>
                    </div>}
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>비밀번호 확인</div>
                    <div className={`flex flex-row items-center border ${confirmPasswordValidation.status == 'error' ? 'border-red-500 border-2' : confirmPasswordValidation.status == 'before' ? 'border-[#CDC5FF]' : 'border-[#816DFF] border'}`}
                        style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type={confirmPasswordVisible ? "text" : "password"} id="password-confirm" name="password-confirm" className="peer flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="비밀번호를 다시 입력해주세요." style={{ padding: '' }}
                            onFocus={() =>
                                setConfirmPasswordValidation({ status: 'pending' })
                            }
                            onBlur={e => {
                                const newValue = e.currentTarget.value;
                                setConfirmPassword(newValue)
                                checkConfirmPasswordValidation(newValue);
                            }} />
                        <div className={`w-4 h-4 ${confirmPasswordVisible ? 'border bg-white' : 'bg-black'} rounded-md cursor-pointer`} onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} />
                    </div>
                    {confirmPasswordValidation.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{confirmPasswordValidation.errorText}</div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

const 약관동의 = () => {


    const setCanNextStep = useSignupStore((state) => state.setCanNextStep);

    const [allAgree, setAllAgree] = useState(false)
    const [usingTermAgree, setUsingTermAgree] = useState(false)
    const [personalInfoAgree, setPersonalInfoAgree] = useState(false)

    useEffect(() => {
        if (allAgree) {
            setUsingTermAgree(true)
            setPersonalInfoAgree(true)
        } else if (usingTermAgree && personalInfoAgree) {
            setUsingTermAgree(false)
            setPersonalInfoAgree(false)
        }
    }, [allAgree])

    useEffect(() => {
        if (usingTermAgree && personalInfoAgree) {
            setAllAgree(true)
            setCanNextStep(true)
        } else if (allAgree) {
            setAllAgree(false)
        }
    }, [usingTermAgree, personalInfoAgree])
    return (
        <div className="flex flex-col flex-grow">
            <div style={{ padding: '0 24px', width: '100%' }}>
                <label
                    htmlFor="all_check"
                    className="flex w-full flex-row items-center cursor-pointer bg-[#E7E7E7]"
                    style={{ padding: '16px 12px', borderRadius: 5, gap: 8 }}
                >
                    <input
                        type="checkbox"
                        checked={allAgree}
                        onClick={() => {
                            setAllAgree(!allAgree)
                        }}
                        name="all_check"
                        id="all_check"
                        className="hidden peer"
                    />
                    <div
                        className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                        style={{ backgroundColor: '#816DFF', width: 16, height: 16 }}
                    >
                        <Image src={checkMark} width={12} alt="" />
                    </div>
                    <div
                        className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
                        style={{ backgroundColor: '#FFF', width: 16, height: 16 }}
                    />
                    <div style={{ fontSize: 14, lineHeight: '16px' }} className="text-[#818181] peer-checked:text-black peer-checked:font-semibold">
                        모든 약관에 동의
                    </div>
                </label>
            </div>
            <div
                className="flex flex-col"
                style={{ padding: '0 24px', width: '100%', gap: 28, marginTop: 28 }}>

                <div className="flex flex-row justify-between items-center"
                    style={{ padding: '0 12px', }}>
                    <label
                        htmlFor="약관"
                        className="flex w-full flex-row items-center cursor-pointer"
                        style={{ borderRadius: 5, gap: 8 }}
                    >
                        <input
                            type="checkbox"
                            checked={usingTermAgree}
                            onClick={() => {
                                setUsingTermAgree(!usingTermAgree)
                            }}
                            name="약관"
                            id="약관"
                            className="hidden peer"
                        />
                        <div
                            className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                            style={{ backgroundColor: '#816DFF', width: 16, height: 16 }}
                        >
                            <Image src={checkMark} width={12} alt="" />
                        </div>
                        <div
                            className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
                            style={{ backgroundColor: '#FFF', width: 16, height: 16 }}
                        />
                        <div className="flex flex-row items-center text-[#818181] peer-checked:text-black peer-checked:font-semibold" style={{ gap: 4 }}>
                            <div style={{ fontSize: 14, lineHeight: '16px' }} className="">약관동의</div>
                            <div style={{ fontSize: 14, lineHeight: '16px', fontWeight: 500 }} className="text-[#FF0000]">(필수)</div>
                        </div>
                    </label>

                    <Image src={ChevronRightIcon} width={16} alt="" className="cursor-pointer" />
                </div>

                <div className="flex flex-row justify-between items-center"
                    style={{ padding: '0 12px', }}>
                    <label
                        htmlFor="개인정보"
                        className="flex w-full flex-row items-center cursor-pointer"
                        style={{ borderRadius: 5, gap: 8 }}
                    >
                        <input
                            type="checkbox"
                            checked={personalInfoAgree}
                            onClick={() => {
                                setPersonalInfoAgree(!personalInfoAgree)
                            }}
                            name="개인정보"
                            id="개인정보"
                            className="hidden peer"
                        />
                        <div
                            className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                            style={{ backgroundColor: '#816DFF', width: 16, height: 16 }}
                        >
                            <Image src={checkMark} width={12} alt="" />
                        </div>
                        <div
                            className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
                            style={{ backgroundColor: '#FFF', width: 16, height: 16 }}
                        />
                        <div className="flex flex-row items-center text-[#818181] peer-checked:text-black peer-checked:font-semibold" style={{ gap: 4 }}>
                            <div style={{ fontSize: 14, lineHeight: '16px' }} className="">개인정보 이용동의</div>
                            <div style={{ fontSize: 14, lineHeight: '16px', fontWeight: 500 }} className="text-[#FF0000]">(필수)</div>
                        </div>
                    </label>
                    <Image src={ChevronRightIcon} width={16} alt="" className="cursor-pointer" />
                </div>
            </div>
        </div>
    )
}

interface inputProps {
    onFocus: () => void
    onBlur: () => void
    onChange: () => void
    validationState: ValidationState
    value: string
}

const inputBaseComponent: React.FC<inputProps> = ({ onFocus, onBlur, onChange, validationState }) => {
    return (
        <div className="w-full" style={{ padding: '0 36px' }}>
            <div className="flex flex-col" style={{ gap: 4 }}>
                <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>패명</div>
                <div className={`flex flex-row items-center border ${validationState.status === 'error' ? 'border-red-500' : 'border-[#CDC5FF]'}`} style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                    <input type="text" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="패명을 입력해주세요." style={{ padding: '' }}
                        onFocus={onFocus}
                        onBlur={onBlur} />
                </div>
                {validationState.status == 'error' && <div className="flex flex-row items-center" style={{ gap: 4 }}>
                    <Image src={WarningCircleIcon} width={12} alt="" />
                    <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>{validationState.errorText}</div>
                </div>}
            </div>
        </div>
    )
}


{/* <form onSubmit={submitHandler} className="w-full flex flex-col gap-2 py-4">
                    <div className=" flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="email" name="loginId" id="loginId" placeholder="ID" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none" autoSave="off" autoComplete="off" />
                    </div>
                    <div className={`flex flex-row items-center border-2 rounded-md px-2 p-1 bg-purple-200 ${PWValid ? `border-purple-400 bg-purple-200` : `border-red-600 bg-red-200`} `}>
                        <span className="w-4 h-4 bg-purple-700" />
                        <input type={PWVisible ? 'text' : 'password'}
                            required
                            autoComplete="off"
                            value={password}
                            placeholder="비밀번호"
                            onChange={e => setPassword(e.currentTarget.value)}
                            onBlur={(e) => {
                                const value = e.currentTarget.value;
                                const regex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,12}$/;
                                setPWValid(regex.test(value));
                            }} name="password" id="password" className={`flex-grow bg-transparent ${PWValid ? `placeholder-purple-400 text-purple-800` : password.length > 0 ? `placeholder-red-400 text-red-600` : `placeholder-red-400 text-red-600 underline`}   py-0.5 px-2 outline-none`} />
                        <span className={`w-4 h-4 ${PWVisible ? "bg-slate-200" : "bg-black"} cursor-pointer`} onClick={() => { setPWVisible(!PWVisible) }} />
                    </div>
                    {!PWValid && <div className=" flex flex-row items-center ">
                        <span className="flex-grow text-xs text-red-400">비밀번호는 영문, 숫자를 포함한 8~12자 이내의 문자입니다.</span>
                    </div>}
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="text" name="name" id="name" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none"
                            placeholder="이름" />
                    </div>
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input type="text" name="clubName" id="clubName" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none"
                            placeholder="패 이름" />
                    </div>
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="date" max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate()}`} name="birth" id="birth"
                            className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-1 outline-none" />
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row flex-grow items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200">
                            <span className="w-4 h-4 bg-purple-700" />
                            <select name="clubAge" id="clubAge" className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none">
                                <option value="" disabled selected>학번</option>
                                {Array.from({ length: 100 }, (_, i) => i).map((number) => <option key={number + 'age'} value={`${number.toString().padStart(2, '0')}`}>{number.toString().padStart(2, '0')}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-row flex-grow items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200">
                            <span className="w-4 h-4 bg-purple-700" />
                            <select required name="gender" id="gender" defaultValue={"M"} className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none">
                                <option value="M">남</option>
                                <option value="F">여</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input
                            placeholder="휴대전화번호"
                            value={phoneNumber}
                            onChange={handleTelChange}
                            required type="tel" name="phoneNumber" id="phoneNumber" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none" />
                    </div>
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input placeholder="이메일(정보 수신)" required type="email" name="email" id="email" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none" />
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2">
                        

    <div className="flex flex-row flex-grow items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
        <span className="w-4 h-4 bg-purple-700" />
        <select name="clubId" id="clubId" className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-1 outline-none">
            <option value="" disabled selected>소속패 ID</option>
            {Array.from({ length: 30 }, (_, i) => i).map((number) => <option key={number + 'club'} value={`${number.toString().padStart(2, '0')}`}>{number.toString().padStart(2, '0')}</option>)}
        </select>
    </div>
                    </div >
                    <div className="flex flex-row items-center justify-between border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <label htmlFor="profile" className=" rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" >프로필 사진 선택</label>
                        <input type="file" name="profile" accept=".jpeg .png" id="profile" className="hidden" />
                    </div>
                    <button type="submit" className="w-full my-1 flex-grow rounded-md bg-purple-800 text-white py-0.5 px-1 outline-purple-700">제출</button>
                </form > */}