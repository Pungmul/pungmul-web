export async function createChatRoom(body: { receiverName: string }) {

    try {
        const response = await fetch('/chats/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });
        if (!response.ok) throw Error('비정상 동작')

        const data = await response.json();

        return data;

    } catch (e) {
        console.error(e);
        alert('비정상 동작');
    }
}
//

export async function loadChatRooms() {
    try {
        const response = await fetch('/chats/roomlist', {
            next: {
                revalidate: 10, // 이 부분만 추가
            },
            credentials: 'include',
            cache: 'no-cache'
        });

        if (!response.ok) throw Error('서버 불안정' + response.status)

        const { simpleChatRoomDTOList:data } = await response.json();
        return data;

    } catch (e) {
        console.error(e);
        alert('비정상 동작');
    }
}