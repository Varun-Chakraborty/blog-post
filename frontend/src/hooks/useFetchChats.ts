import { useEffect } from 'react';
import { chatService, socketService } from '@/services';
import { useAppDispatch, useAppSelector } from './redux';
import { chatActions } from '@/redux/chat';
import { isAxiosError } from 'axios';
import { profileActions } from '@/redux/profile';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { isGuestProfile } from './isGuestProfile';

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
        .then(res => dispatch(chatActions.setUnreadChats(res)))
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
        .then(res => dispatch(chatActions.setChats(res)))
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
  socketService.onNewMessage(async data => {
    const doesThisChatExist = chats.find(c => c.id === data.chatId);
    if (!doesThisChatExist) {
      const chat = await chatService.getChatPreviewById(data.chatId);
      dispatch(chatActions.appendChat(chat));
    }
    if (location.pathname !== `/chat/${data.chatId}`) {
      const doesThisChatExist = unreadChats.find(c => c.id === data.chatId);
      if (!doesThisChatExist) {
        try {
          const chat = (await chatService.getChatPreviewById(data.chatId))!;
          dispatch(chatActions.appendUnreadChat(chat));
        } catch (error) {
          if (isAxiosError(error)) {
            toast({
              title: 'Failed to fetch chat',
              description: error.response?.data.message,
              variant: 'destructive'
            });
          }
          console.error(error);
        }
      }
      dispatch(chatActions.updateLatestMessage(data));
    } else {
      dispatch(
        chatActions.updateLatestMessage({
          data,
          toUnreadChats: true
        })
      );
    }
  });
}
