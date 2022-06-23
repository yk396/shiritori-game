import { serve } from "https://deno.land/std@0.138.0/http/server.ts";

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

var l=3;
var c="あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわ";
var r='';
var cl=c.length;
for(var i=0; i<l; i++){
  r+=c[Math.floor(Math.random()*cl)];
}
let previousWord = r;

console.log("Listening on http://localhost:8000");

serve(async (req) => {

  const pathname = new URL(req.url).pathname;

  if (req.method === "GET" && pathname === "/shiritori") {
    return new Response(previousWord);
  }

  if (req.method === "POST" && pathname === "/shiritori") {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;

    if (//前の単語に続いていないとき
      nextWord.length > 0 &&
      previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
    ){

      return new Response("前の単語に続いていません。", { status: 400 });

    }
    if(//「ん」で終わっているとき
      nextWord.length > 0 &&
      nextWord.charAt(nextWord.length-1)=="ん"
    ){
      return new Response("「ん」で終わっています。", { status: 400});
    }
    if(//「を」で終わっているとき
    nextWord.length > 0 &&
    nextWord.charAt(nextWord.length-1)=="を"
    ){
    return new Response("「を」で終わっています。", { status: 400});
    }
    if(//「ー」で終わっているとき
    nextWord.length > 0 &&
    nextWord.charAt(nextWord.length-1)=="ー"
    ){
  return new Response("「ー」で終わっています。", { status: 400});
    }
    previousWord = nextWord;
    return new Response(previousWord);

  }

  return serveDir(req, {

    fsRoot: "public",

    urlRoot: "",

    showDirListing: true,

    enableCors: true,

  });

});