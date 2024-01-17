import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useAjax} from "@/lib/ajax.ts";

const Video = () => {
  const [video, setVideo] = useState<string>()
  const [prompt, setPrompt] = useState("")
  const {post} = useAjax()

  const onGenerate = () => {
    post<string[]>("/video", {
      prompt
    }).then(res => {
      setVideo(res.data[0])
    })
  }

  return (
    <div>
      <Input value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
      <div>
        {video && <video controls className={"w-full mt-8"} src={video}/>}
      </div>
      <Button onClick={() => onGenerate()}>Generate</Button>
    </div>
  );
}

export default Video

