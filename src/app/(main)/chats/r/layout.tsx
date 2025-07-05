import ChatList from "../ChatList";
import { SelectFriendModalProvider } from "@/store/friend/useSelectFriendModalContext";
import RoomPage from "./RoomPage";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-full w-full flex-grow overflow-x-hidden">
      <SelectFriendModalProvider>
        <ChatList key="chat-list" />
        <RoomPage>{children}</RoomPage>
      </SelectFriendModalProvider>
    </div>
  );
}
