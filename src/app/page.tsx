"use client"

import Head from 'next/head';
import MetadataBox from "./metadata.tsx";
import ReaderInit from "../../reader.js";
import { useState, useEffect, ChangeEvent } from 'react';

async function handleDrop(items : any[], setMetadata : (arg0:{[k:string]:any}) => void, setImage : (arg0:File | null) => any, setVersion : (arg0:number) => any) {
  console.log("Dropped something", items[0]);
  //const handles = items.filter(f => f.kind === "file").map(f => f.getAsFileSystemHandle()); // safari unsupported
  const handles : File[] = items.filter(f => f.constructor.name === File.name || f.kind === "file").map(f => f.constructor.name === File.name ? f : f.getAsFile());
  for await (const h of handles) {
    //if (h.kind && h.kind !== "file") continue; // ignore directories for now
    //let file = h.kind ? await h.getFile() : h;
    let file : File | null = h;
    const data = new Uint8Array(await file.arrayBuffer());
    const reader = await ReaderInit();
    let md = reader.readMetadata(data);
    if (!md) {
      // TODO show error
      md = {"error": {"error.error":"Could not process file"}};
      file = null;
    } else if (Object.entries(md).length <= 0) {
      md["info"] = {"info.info": "No metadata found"};
    }
    setMetadata(md);
    setImage(file);
    setVersion(Date.now()); // to reset section collapsed state
  }
}

export default function Home() {
  const [image, setImage] = useState<File|null>(null);
  const [metadata, setMetadata] = useState({});
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const pasteHandler = (ev : ClipboardEvent) => {
      ev.preventDefault();
      if (!ev.clipboardData) return;
      //handleDrop([...(ev.clipboardData || ev.originalEvent.clipboardData).items], setMetadata, setImage, setVersion);
      handleDrop([...ev.clipboardData.items], setMetadata, setImage, setVersion);
    };
    window.addEventListener('paste', pasteHandler);

    const dropHandler = (ev : DragEvent) => {
      ev.preventDefault();
      if (ev.dataTransfer && ev.dataTransfer.items) {
        handleDrop([...ev.dataTransfer.items], setMetadata, setImage, setVersion);
      }
    };
    window.addEventListener('drop', dropHandler);

    const dragHandler = (ev : DragEvent) => {
      ev.preventDefault();
      return false;
    };
    window.addEventListener('dragleave', dragHandler);
    window.addEventListener('dragover', dragHandler);

    return () => {
      window.removeEventListener('paste', pasteHandler);
      window.removeEventListener('drop', dropHandler);
      window.removeEventListener('dragleave', dragHandler);
      window.removeEventListener('dragover', dragHandler);
    };
  }, []);
  function handleFile(ev : ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();
    if (ev.target.files && ev.target.files[0]) {
      handleDrop([...ev.target.files], setMetadata, setImage, setVersion);
    }
    return false;
  }
  return (
    <div className="w-3/4 mx-auto">
        <h1 className="text-3xl font-bold text-center p-6">
          Image Metadata Viewer
        </h1>
        <div className="w-3/4 m-auto text-center">Fastest and most secure image metadata viewer on the Internet. All processing is done locally. Your images and metadata never leave your device.</div>

        <div className="text-center p-6 m-6 bg-sky-50 rounded border border-sky-600">
          Drop or paste an image anywhere on this page or <label htmlFor="upload-file" className="cursor-pointer underline">browse</label><input className="hidden" id="upload-file" type="file" onChange={handleFile} />
        </div>

      <MetadataBox key={version} image={image} md={metadata} />

      <footer className="py-8 text-center">
        Built by <a href="https://transfix.ai">Transfix</a> in San Diego 🌴
      </footer>
    </div>
  )
}
