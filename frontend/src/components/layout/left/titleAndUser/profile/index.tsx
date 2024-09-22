import { useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ProfileCard } from "./ProfileCard";

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
          "border border-border rounded-md absolute z-50 overflow-hidden w-full bg-card",
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