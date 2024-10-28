import { useEffect } from 'react';
import { useCurrentUserProfile } from '.';
import api from '@/api';
import { useAppDispatch } from './redux';
import { chatActions } from '@/redux/chat';
import { isAxiosError } from 'axios';
import { profileActions } from '@/redux/profile';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function useFetchUnreadChats() {
  const me = useCurrentUserProfile();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (me) {
      api
        .getUnreadChats(me.username)
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
    }
  }, [me]);
  api.socket.on('new-message', data => {
    dispatch(chatActions.appendUnreadChat(data));
  });
}
