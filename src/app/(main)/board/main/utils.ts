export const loadBoardInfomations = async () => {
    try {
        
        const response = await fetch('/board/main/api', {
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