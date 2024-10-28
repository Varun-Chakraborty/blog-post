import { ChatComponent } from './chatComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCreateOutline } from 'react-icons/io5';
import { toast, useToast } from '@/components/ui/use-toast';
import { isAxiosError } from 'axios';
import { useCurrentUserProfile } from '@/hooks';
import { ChatPreview, Profile } from '@/types';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/api';

export function ChatPreviewScreen({
  chats,
  setChats,
  className
}: Readonly<{
  chats: ChatPreview[];
  setChats: React.Dispatch<React.SetStateAction<ChatPreview[]>>;
  className?: string;
}>) {
  const location = useLocation();
  const isItRoot = location.pathname.endsWith('/chat');

  return (
    <div
      className={cn(
        'border-r sm:w-1/5 shrink-0 sm:block hidden',
        { 'block w-full': isItRoot },
        className
      )}
    >
      <div className="flex justify-between border-b p-4">
        <div>Messages</div>
        <NewChatButton setChats={setChats} />
      </div>
      <div className="p-4 space-y-2 overflow-y-auto">
        {chats.map(chat => (
          <ChatComponent chat={chat} key={chat.id} />
        ))}
      </div>
    </div>
  );
}

function NewChatButton({
  setChats,
  className
}: Readonly<{
  setChats: React.Dispatch<React.SetStateAction<ChatPreview[]>>;
  className?: string;
}>) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const me = useCurrentUserProfile();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // if (isOpen) api.getFollowers(me!.username).then(res => setProfiles(res));
    setProfiles(() => [me!]);
  }, [isOpen]);

  async function createChat() {
    try {
      const chatId = await api.createChat([me!.username], 'CHAT');
      const chat = await api.getChatPreviewById(chatId);
      setChats(prev => [...prev, chat]);
      navigate(`/chat/${chatId}`);
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: 'Failed to create chat',
          description: error.response?.data.message,
          variant: 'destructive'
        });
      }
      console.error(error);
    }
  }
  return (
    <Popover>
      <PopoverTrigger>
        <span className={className} onClick={() => setIsOpen(prev => !prev)}>
          <IoCreateOutline title="New Chat" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <p className="font-bold">
          You can start conversation with any of the following
        </p>
        <div>
          {profiles.map(profile => (
            <button
              key={profile.id}
              className="w-full hover:bg-primary/10 p-2 rounded-lg"
              onClick={createChat}
            >
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div className="w-full text-left">
                  <div className="font-bold uppercase">{profile.name}</div>
                  <div className="text-xs">@{profile.username}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Dialog>
          <DialogTrigger className="block w-full">
            <span className="block w-full rounded-full border px-4 p-1 hover:bg-primary/10 font-bold">
              Or you can create a group
            </span>
          </DialogTrigger>
          <CreateGroupDialog />
        </Dialog>
      </PopoverContent>
    </Popover>
  );
}

function CreateGroupDialog() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const me = useCurrentUserProfile();
  const [participants, setParticipants] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    // if (isOpen) api.getFollowers(me!.username).then(res => setProfiles(res));
    setProfiles(() => [me!]);
  }, []);

  return (
    <>
      <DialogTitle>
        <p className="font-bold">Create Group</p>
        <p className="text-sm">Add people to your group</p>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-2">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="flex justify-between items-center w-full hover:bg-primary/10 p-2 rounded-lg"
            >
              <Label
                className="flex items-center gap-2 w-full cursor-pointer"
                htmlFor={profile.id}
              >
                <Avatar>
                  <AvatarImage src={profile.pfp ?? '/placeholder-user.jpg'} />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div className="w-full text-left">
                  <div className="font-bold uppercase">{profile.name}</div>
                  <div className="text-xs">@{profile.username}</div>
                </div>
              </Label>
              <Checkbox
                id={profile.id}
                disabled={profile.username === me!.username}
                checked={participants.includes(profile.username)}
                onCheckedChange={checked => {
                  if (checked) {
                    setParticipants(prev => [...prev, profile.username]);
                  } else {
                    setParticipants(prev =>
                      prev.filter(
                        participant => participant !== profile.username
                      )
                    );
                  }
                }}
              />
            </div>
          ))}
        </div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (participants.length < 1) {
              toast({
                title: 'Failed to create group',
                description: 'You need to add at least 1 user',
                variant: 'destructive'
              });
              return;
            }
            try {
              await api.createChat(participants, 'GROUP', groupName);
              toast({
                title: 'Group created',
                description: 'Group created successfully'
              });
            } catch (error) {
              if (isAxiosError(error)) {
                toast({
                  title: 'Failed to create group',
                  description: error.response?.data.message,
                  variant: 'destructive'
                });
              }
              console.error(error);
            }
          }}
          className="flex flex-col gap-2"
        >
          <Input
            type="text"
            placeholder="Group name"
            className="w-full"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
          <Button
            type="submit"
            className="block w-full rounded bg-accent text-white uppercase p-2"
          >
            Create
          </Button>
        </form>
      </DialogContent>
    </>
  );
}
