import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {FC} from "react";

type UserAvatarProps = React.ComponentProps<typeof Avatar>

const UserAvatar: FC<UserAvatarProps> = (props) => {
  return (
    <Avatar {...props} className={"cursor-pointer transition-transform transform hover:scale-105 ease-in"}>
      <AvatarImage src="https://github.com/shadcn.png"/>
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar

