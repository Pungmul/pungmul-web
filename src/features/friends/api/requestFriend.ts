export const requestFriend = async (friendId: string) => {
  try {
    const response = await fetch(`/api/friends/add?friendId=${friendId}`, {
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

