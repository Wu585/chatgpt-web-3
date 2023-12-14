import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

const UserAvatar = () => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png"/>
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar

