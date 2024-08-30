import { useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import { Profile as ProfileType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface ProfileProps {
  profile: ProfileType;
  current?: boolean;
  onClick: () => void;
  listOpen?: boolean;
}

export function Profile() {
  const {profiles, currentProfile} = useAppSelector((state) => state.profile);

  const [openProfileList, setOpenProfileList] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  function toggleProfileList() {
    setOpenProfileList(!openProfileList);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as HTMLDivElement)
      ) {
        setOpenProfileList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  return (
    <div className="box-border relative" ref={profileRef}>
      <div
        className={cn(
          "border border-borderColor rounded-md absolute z-50 overflow-hidden w-full shadow-gray-300 bg-white dark:shadow-gray-800",
          { "shadow-lg": openProfileList }
        )}
      >
        {profiles
          .filter((profile) => profile.id === currentProfile)
          .map((profile) => (
            <ProfileCard
              profile={profile}
              current
              key={profile.username}
              onClick={() => toggleProfileList()}
              listOpen={openProfileList}
            />
          ))}
      </div>
    </div>
  );
}

function ProfileCard({
  profile,
  current = false,
  onClick,
  listOpen,
}: ProfileProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-cardBackgroundColor cursor-pointer hover:bg-gray-100 dark:hover:bg-backgroundColor p-3"
    >
      <div className="flex items-center gap-2">
        <img
          src={profile.pfp ?? "/placeholder-user.jpg"}
          alt=""
          className="w-10 h-10 rounded-full border border-borderColor"
        />
        <div className="flex flex-col justify-center">
          <span className="font-semibold uppercase text-sm">{profile.name}</span>
          <span className="text-secondaryText text-xs">
            @{profile.username}
          </span>
        </div>
      </div>
      {current &&
        (listOpen ? (
          <IoChevronUp className="w-4 h-4" />
        ) : (
          <IoChevronDown className="w-4 h-4" />
        ))}
    </div>
  );
}
