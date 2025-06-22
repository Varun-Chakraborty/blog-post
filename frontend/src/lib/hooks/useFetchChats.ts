import { useEffect } from 'react';
import { chatService, socketService } from '@/services';
import { useAppDispatch, useAppSelector } from './redux';
import { chatActions } from '@/lib/redux/chat';
import { isAxiosError } from 'axios';
import { profileActions } from '@/lib/redux/profile';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { isGuestProfile } from './isGuestProfile';
import type { Message } from '@/types/baseTypes';

export function useFetchChats() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { chats, unreadChats } = useAppSelector(state => state.chat);
  const { profile } = useAppSelector(state => state.profile);
  const isItGuest = isGuestProfile();
  const location = useLocation();
  useEffect(() => {
    if (!isItGuest) {
      chatService
        .getUnreadChats()
        .then(unreadChats => {
          dispatch(chatActions.setUnreadChats({ unreadChats: unreadChats! }));
        })
        .catch(e => {
          if (isAxiosError(e)) {
            if (e.response?.status === 401) {
              dispatch(profileActions.removeProfile());
              navigate('/login');
              toast('Error');
            }
          }
        });

      chatService
        .getChats()
        .then(chats => {
          dispatch(chatActions.setChats({ chats: chats! }));
        })
        .catch(e => {
          if (isAxiosError(e)) {
            if (e.response?.status === 401) {
              dispatch(profileActions.removeProfile());
              navigate('/login');
              toast('Error');
            }
          }
        });
    }
  }, [profile]);
  useEffect(() => {
    const newMessageHandler = async (data: {
      chatId: string;
      message: Message;
    }) => {
      let chatPreview = chats.find(c => c.chatId === data.chatId);

      // if chat preview is not present, fetch it
      if (!chatPreview) {
        chatPreview = await chatService
          .getChatPreviewById(data.chatId)
          .then(chatPreview => chatPreview)
          .catch(e => {
            toast('Failed to fetch chat');
            console.error(e);
            return undefined;
          });
      }
      // if not in the chat
      if (location.pathname !== `/chat/${data.chatId}`) {
        dispatch(chatActions.appendChat({ newChat: chatPreview! }));
        const isTheChatUnread = unreadChats.find(c => c.chatId === data.chatId);
        if (!isTheChatUnread) {
          dispatch(chatActions.appendUnreadChat({ newChat: chatPreview! }));
        }
        dispatch(
          chatActions.updateLatestMessage({ data, toUnreadChats: true })
        );
      } else {
        // if already in the chat
        dispatch(chatActions.appendChat({ newChat: chatPreview! }));
        dispatch(
          chatActions.updateLatestMessage({ data, toUnreadChats: false })
        );
      }
    };

    socketService.onNewMessage(newMessageHandler);

    return () => socketService.offNewMessage(newMessageHandler);
  }, [location]);
}
