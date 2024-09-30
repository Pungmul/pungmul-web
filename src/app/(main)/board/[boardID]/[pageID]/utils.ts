export const loadPost = async (id: number) => {
    try {

        const response = await fetch(`${id}/api?postID=${id}`, {
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