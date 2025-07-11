import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { userService } from '@/services';
import { profileActions } from '../redux/profile';

export function useProfile() {
	const dispatch = useAppDispatch();
	useEffect(() => {
    userService.getProfileSummary('me').then(profileSummary => {
			dispatch(profileActions.setLoggedIn(profileSummary));
		});
	}, []);
}
