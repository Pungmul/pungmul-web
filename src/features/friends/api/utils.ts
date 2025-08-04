const findFriends = async (keyword: string) => {
    try {
        const response = await fetch(`friends/search?keyword=${keyword}`, {
            method: 'GET',
            credentials: 'include'
        })

        if (!response.ok) throw Error('비정상 동작')

        const foundList = await response.json();
        return foundList;
    } catch (e) {
        console.error(e);
    }
    return [];
}

const requestFriend = async (friendId: string) => {
    try {
        const response = await fetch(`friends/add?friendId=${friendId}`, {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) throw Error('비정상 동작')

        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

const acceptFriendRequest = async (friendRequestId: number) => {
    try {
        const response = await fetch(`friends/accept?friendRequestId=${friendRequestId}`, {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) throw Error('비정상 동작')

        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

const rejectFriendRequest = async (friendRequestId: number) => {
    try {
        const response = await fetch(`friends/decline?friendRequestId=${friendRequestId}`, {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) throw Error('비정상 동작')

        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

export { findFriends, requestFriend, acceptFriendRequest, rejectFriendRequest }