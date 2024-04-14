import { useDispatch, useSelector } from "react-redux";
import { auth_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { actions } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import Modals from "../components/modals";

export default function UserProfile() {
    const userInfo = { ...useSelector(state => state.users.userInfo) };
    userInfo.followers = 0;
    userInfo.following = 0;
    const [showDialog, setShowDialog] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleAccountDelete = async () => {
        try {
            await auth_service.deleteAccount();
            dispatch(actions.logout());
            toast.success('Deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error("Can't delete");
            console.error(error);
        } finally {
            setShowDialog(false);
        }
    }
    return (
        <main className="min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white flex justify-center items-center relative">
            <Button
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white p-2 rounded-xl absolute top-5 right-5"
                onClick={() => setShowDialog(true)}
                type="button">Delete Account</Button>

            <div className="bg-slate-400 w-1/2 h-1/2 rounded-lg p-2">
                <div>{'@' + userInfo.name}</div>
                <div className="flex justify-between px-5 pt-7">
                    <div className="text-center">
                        <div>0</div>
                        <div>Posts</div>
                    </div>
                    <div className="text-center">
                        <div>0</div>
                        <div>Followers</div>
                    </div>
                    <div className="text-center">
                        <div>0</div>
                        <div>Followings</div>
                    </div>
                </div>
                <div className="flex justify-between px-5 pt-7">
                    <Button className="hover:bg-slate-600 text-center">Edit</Button>
                    <Button className="hover:bg-slate-600 text-center">Posts</Button>
                </div>
            </div>

            {showDialog && (
                <Modals
                    timeOut={true}
                    setShowDialog={setShowDialog}
                    open={showDialog}
                    msg='are you sure that you want to delete this account?'
                    options={{ positive: 'Yes', negative: 'No' }}
                    handleIfYes={handleAccountDelete} />
            )}
        </main>
    );
}