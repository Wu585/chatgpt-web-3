import {useState} from "react";
import {useAjax} from "@/lib/ajax.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

const Music = () => {
  const [music, setMusic] = useState<string>()
  const [prompt, setPrompt] = useState("")
  const {post} = useAjax()

  const onGenerate = () => {
    post<string[]>("/music", {
      prompt
    }).then(res => {
      setMusic(res.data[0])
    })
  }

  return (
    <div>
      <Input value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
      <div>
        {music && <audio controls className={"w-full mt-8"} src={music}/>}
      </div>
      <Button onClick={() => onGenerate()}>Generate</Button>
    </div>
  );
}

export default Music

