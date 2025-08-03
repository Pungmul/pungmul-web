import SockJS from "sockjs-client";

export function mySocketFactory() {
  return new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`);
}
