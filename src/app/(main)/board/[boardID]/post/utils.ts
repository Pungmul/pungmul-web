const postContext = async (title: string, text: string, anonymity: boolean, boardId: number) => {
    try {
        const response = await fetch(`post/api?boardId=${boardId}`, {
            method: 'POST',
            body: JSON.stringify({ text, title, anonymity })
            ,
            credentials: 'include'
        })

        if (!response.ok) throw Error('비정상 동작')

        const data = await response.json();

        return data.postId;
    } catch (e) {
        console.error(e);
    }
    return false;
}

export default postContext