import {Input} from "@/components/ui/input.tsx";
import {SendHorizonal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {ChangeEvent, FC, FormEvent} from "react";
// import {SpeechAudio} from "@/components/SpeechAudio.tsx";
import {useModelStore} from "@/store/useModelStore.tsx";
import {SpeechAudio} from "@/components/SpeechAudio.tsx";

interface FormInputProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

const FormInput: FC<FormInputProps> = ({input, handleInputChange, onSubmit, isLoading}) => {
  const {setModel, model} = useModelStore()
  const onChangeModel = () => {
    model === "gpt-3.5-turbo" ? setModel("gpt-4-32k") : setModel("gpt-3.5-turbo")
  }

  return (
    <div className={"flex items-center w-full py-2 md:justify-center"}>
      <form onSubmit={onSubmit} className={"w-full md:w-3/4 h-12 flex relative items-center"}>
        <Button className={"bg-black text-white"} type={"button"} onClick={onChangeModel}>{
          model === "gpt-3.5-turbo" ? "切换到4.0" : "切换到3.5"
        }</Button>
        <SpeechAudio/>
        {/*<Mic className={"h-8 w-12 px-1 cursor-pointer"}/>*/}
        <Input value={input} onChange={handleInputChange} disabled={isLoading}
               className={"h-full placeholder:text-primary flex-1 w-full"} placeholder={"您好，想问点什么?"}/>
        <Button className={"ml-2 cursor-pointer bg-black text-white h-full w-16"}>
          <SendHorizonal/>
        </Button>
      </form>
    </div>
  );
}

export default FormInput

