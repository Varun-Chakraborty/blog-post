import { useDispatch, useSelector } from "react-redux";
import { auth_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { actions } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import Modals from "../components/modals";

/**
 * User Profile page.
 * @returns {JSX.Element} User Profile page
 */
export default function UserProfile() {
    // Destructure user info state from Redux store
    const userInfo = { ...useSelector(state => state.users.userInfo) };
    // Set default followers and followings count to 0
    userInfo.followers = 0;
    userInfo.following = 0;
    // State to control modals
    const [showDialog, setShowDialog] = useState(false);
    // Redux dispatch
    const dispatch = useDispatch();
    // React Router navigate method
    const navigate = useNavigate();

    /**
     * Handle user account deletion.
     * @returns {Promise<void>} Handle user account deletion
     */
    const handleAccountDelete = async () => {
        try {
            // Try to delete user's account
            await auth_service.deleteAccount();
            // Dispatch logout action
            dispatch(actions.logout());
            // Show success message
            toast.success('Deleted successfully');
            // Navigate to home page
            navigate('/');
        } catch (error) {
            // Show error message
            toast.error("Can't delete");
            // Log error to console
            console.error(error);
        } finally {
            // Close modal
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
                <div>{`@${userInfo.name}`}</div>
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
                    // time out to allow user to click 'Yes' button
                    timeOut={true}
                    // Set show dialog state
                    setShowDialog={setShowDialog}
                    // Set open state to showDialog
                    open={showDialog}
                    // Set delete account question
                    msg='are you sure that you want to delete this account?'
                    // Set options object
                    options={{ positive: 'Yes', negative: 'No' }}
                    // Set function to handle 'Yes' button click
                    handleIfYes={handleAccountDelete} />
            )}
        </main>
    );
}
