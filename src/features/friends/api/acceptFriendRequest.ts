export const acceptFriendRequest = async (friendRequestId: number) => {
  try {
    const response = await fetch(`/api/friends/accept?friendRequestId=${friendRequestId}`, {
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

