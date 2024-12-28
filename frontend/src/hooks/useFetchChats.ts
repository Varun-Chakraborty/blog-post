import { useEffect } from 'react';
import { chatService, socketService } from '@/services';
import { useAppDispatch, useAppSelector } from './redux';
import { chatActions } from '@/redux/chat';
import { isAxiosError } from 'axios';
import { profileActions } from '@/redux/profile';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { isGuestProfile } from './isGuestProfile';
import { Message } from '@/types/baseTypes';

export function useFetchChats() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
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
              toast({
                title: 'Error',
                description: 'You have been logged out',
                variant: 'destructive'
              });
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
              toast({
                title: 'Error',
                description: 'You have been logged out',
                variant: 'destructive'
              });
            }
          }
        });
    }
  }, [profile]);
  useEffect(() => {
    console.log('\n');
    const newMessageHandler = async (data: {
      chatId: string;
      message: Message;
    }) => {
      let chatPreview = chats.find(c => c.id === data.chatId);

      // if chat preview is not present, fetch it
      if (!chatPreview) {
        chatPreview = await chatService
          .getChatPreviewById(data.chatId)
          .then(chatPreview => chatPreview)
          .catch(e => {
            toast({
              title: 'Failed to fetch chat',
              variant: 'destructive'
            });
            console.error(e);
            return undefined;
          });
      }

      console.log(
        '1',
        location.pathname,
        '2',
        `/chat/${data.chatId}`,
        '3',
        location.pathname === `/chat/${data.chatId}`
      );
      // if not in the chat
      if (location.pathname !== `/chat/${data.chatId}`) {
        console.log('not in the chat');
        dispatch(chatActions.appendChat({ newChat: chatPreview! }));
        const isTheChatUnread = unreadChats.find(c => c.id === data.chatId);
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
