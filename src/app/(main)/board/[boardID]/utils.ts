export const loadMorePosts = async (id: number, page: number = 0, size: number = 10) => {
    try {

        const response = await fetch(`/board/${id}/api?page=${page}&size=${size}`, {
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