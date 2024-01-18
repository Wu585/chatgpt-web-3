import {Input, InputProps} from "@/components/ui/input.tsx";
import {FC} from "react";
import {cn} from "@/lib/utils.ts";

interface NoBorderInputProps extends InputProps {
}

const NoBorderInput: FC<NoBorderInputProps> = (props) => {
  return (
    <Input
      {...props}
      className={cn("border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent",props.className)}
    />
  );
}

export default NoBorderInput

