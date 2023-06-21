import Image from 'next/image';
import ChevronDown from "./chevron-down.svg";
import ChevronUp from "./chevron-up.svg";
import { useState, SyntheticEvent } from 'react';


type foo = { [k:string]:boolean };
type bar = (arg0:foo) => void;

function MetadataType( typ : string, md : { [k:string]:any }, collapsedSet : foo, setCollapsed : bar) {
  const id = `id_${typ}_${Date.now()}`;
  const collapsed = collapsedSet[typ];
  let zzz = 0;
  function collapseHandler(ev : SyntheticEvent ){
    collapsedSet[typ] = !collapsedSet[typ];
    setCollapsed(Object.fromEntries(Object.entries(collapsedSet)));
  }
  return <div key={`${id}_container`}>
    <div onClick={collapseHandler} className="text-2xl font-bold p-2 hover:cursor-pointer"><Image src={collapsed ? ChevronUp : ChevronDown} alt="Toggle Collapse" className="inline mx-2" />{typ}</div>
    <table id={id} className={`w-full table-fixed break-words ${collapsed ? "hidden" : "table"}`}>
      <thead>
        <tr>
          <th key={`${id}_header_k`} className="text-end font-bold text-slate-900 p-2">Key</th>
          <th key={`${id}_header_v`} className="text-start font-bold text-slate-900 p-2 w-3/4">Value</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 py-2 align-top">
      { Object.entries(md).map(([k, v]) => {
        const ks = k.slice(typ.length + 1);
        const z = `${id}_${k}_${zzz++}`;
        return <tr key={z} className="odd:bg-white even:bg-slate-50">
          <td className="text-end font-medium text-slate-900 p-2 w-1/8">{ks}</td>
          <td className="text-start p-2 w-full">{v}</td>
        </tr>;
      })}
      </tbody>
    </table>
  </div>
}

export default function MetadataBox({ image, md } : {image: File | null, md: { [k:string]:any }}){
  const keys = ["error", "info", "xmp", "exif", "iptc"];
  const [collapsed, setCollapsed] = useState(Object.fromEntries(keys.map(k => [k, false])));
  if (!md) return <></>;
  const k = keys.filter(k => !!md[k]);
  if (k.length <= 0) return <></>;
  // if we don't reach this point then something is wrong with the calling convention for this function
  const mmm = k.map(k => MetadataType(k, md[k], collapsed, setCollapsed));
  const img = !image ? <></> : <Image src={URL.createObjectURL(image)} width="200" height="200" className="max-w-[200px] max-h-[200px] w-auto h-auto" alt="Uploaded Image"/>
  return <div>
    <div className="flex flex-row justify-center">
      <h1 className="text-xl font-bold px-8">Metadata Detected</h1>
      {img}
    </div>
    {mmm}
  </div>
}
