const postContextRequest = async ({boardId, formData}: {boardId: number, formData: FormData}) => {
    try {

        const response = await fetch(`post/api?boardId=${boardId}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })

        if (!response.ok) throw Error('비정상 동작')

        const data = await response.json();

        return data;
    } catch (e) {
        console.error(e);
    }
    return false;
}

export default postContextRequest