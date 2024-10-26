export const loadPosts = async (id: number) => {
    try {

        const response = await fetch(`/board/${id}/api?boardId=${id}`, {
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

export const loadMorePosts = async (id: number) => {
    try {

        const response = await fetch(`/board/${id}/api?boardId=${id}`, {
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