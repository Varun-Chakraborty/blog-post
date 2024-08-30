import { checkIfCurrentIsGuestProfile } from "@/hooks/checkIfCurrentIsGuestProfile";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export function NewProfile({
  openProfileList,
  setOpenProfileList,
}: {
  openProfileList: boolean;
  setOpenProfileList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  if (openProfileList && !checkIfCurrentIsGuestProfile())
    return (
      <div
        onClick={() => {
          navigate("/login");
          setOpenProfileList(false);
        }}
        className="w-full p-2 text-blue-600 flex justify-center items-center gap-2 cursor-pointer hover:bg-blue-100"
      >
        <CiCirclePlus className="w-6 h-6" />
        <span>Add Profile</span>
      </div>
    );

  return null;
}
