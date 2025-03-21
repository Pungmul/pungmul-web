export const clickLike = async (id: number) => {
    try {
        const response = await fetch(`${id}/like?postID=${id}`, {
            method: 'POST',
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

export const addComment = async (id: number, comment: string) => {
    try {
        const response = await fetch(`${id}/comment?postID=${id}`, {
            method: 'POST',
            body: JSON.stringify({ content: comment })
            ,
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

export const addReply = async (id: number, comment: string, parentId: number) => {
    try {
        const response = await fetch(`${id}/comment?postID=${id}`, {
            method: 'POST',
            body: JSON.stringify({ content: comment, parentId })
            ,
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