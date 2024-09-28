export const getInstrumentsInfomation = async () => {
    try {
        const response = await fetch('my-page/api', {
            credentials:'include'
        })

        if (!response.ok) throw Error('비정상 동작')
        
        const data = await response.json();
        
        return data;
    } catch (e) {
        console.error(e);
    }
    return false;
}

export const addInstrumentSkill = async (addInst: string) => {
    try {
        const sendInfo = [{
            instrument: addInst,
            instrumentAbility: "UNSKILLED",
            major: false
        }]
        
        const response = await fetch('my-page/api', {
            method: 'POST',
            body: JSON.stringify(sendInfo)
        })

        if (!response.ok) throw Error('비정상 동작')

        console.log(response.json)
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}
