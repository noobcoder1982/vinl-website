import clsx from "clsx";
import svgPaths from "./svg-3eqetirrr5";
import imgSearch from "figma:asset/8f8a4715a798d8de592e2c396ea0aa59e383f475.png";
import imgPlaylist from "figma:asset/dba3af193df85a07d3dfce7a5985ca67bf84e1a0.png";
import imgImage9 from "figma:asset/6ac6f021cbabc91a580d5640efddeb01fda85fed.png";
import imgHomeScreen from "figma:asset/5012e1b4875e4ce827481ef9a3d28889a43f9bbf.png";
import imgImage5 from "figma:asset/0bfdc41084da15b3aa5fbf86beb803f13cfc97d6.png";





function VinylPlayerPhotoText({ text, additionalClassNames = "" }) {
  return (
    <div className={clsx("absolute size-[204px]", additionalClassNames)}>
      <div className="absolute bg-gradient-to-b from-[rgba(255,157,0,0.2)] inset-0 rounded-[16px] to-[rgba(153,0,0,0.2)]" data-name="vinyl_selector" />
      <p className="absolute capitalize font-['Neue_Montreal:Regular',sans-serif] inset-[85.78%_17.65%_5.88%_17.65%] leading-[normal] not-italic text-[24.264px] text-white whitespace-nowrap">{text}</p>
      <div className="absolute contents inset-[2.45%_2.98%_3.47%_2.94%]">
        <div className="absolute bg-white inset-[2.45%_2.98%_3.47%_2.94%] rounded-[13px]" />
        <div className="absolute aspect-[191.9235076904297/191.9235076904297] left-[2.94%] pointer-events-none right-[2.98%] rounded-[13px] top-[5px]" data-name="image 5">
          <div className="absolute inset-0 overflow-hidden rounded-[13px]">
            <img alt="" className="absolute left-[-8.44%] max-w-none size-[116.88%] top-[-8.44%]" src={imgImage5} />
          </div>
          <div aria-hidden="true" className="absolute border border-[#e11d48] border-solid inset-[-1px] rounded-[14px]" />
        </div>
      </div>
    </div>);

}





function PlayerText({ text, additionalClassNames = "" }) {
  return (
    <div style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" }} className={clsx("absolute flex items-center justify-center left-[36px] w-[17px]", additionalClassNames)}>
      <div className="flex-none rotate-90">
        <p className="capitalize font-['Neue_Montreal:Regular',sans-serif] leading-[normal] not-italic relative text-[24.264px] text-white whitespace-nowrap">{text}</p>
      </div>
    </div>);

}




function SidebarHelper({ additionalClassNames = "" }) {
  return (
    <div className={clsx("absolute h-[18px] left-[170px] w-[16px]", additionalClassNames)}>
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[0.615px] items-center justify-center py-[2.462px] relative size-full">
          <div className="flex h-[2.48px] items-center justify-center relative shrink-0 w-[10.975px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" }}>
            <div className="flex-none rotate-[0.09deg]">
              <div className="h-[2.462px] relative w-[10.971px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.8275 4">
                  <path d={svgPaths.p3ea3a400} fill="var(--fill-0, white)" id="Vector 6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-[9.538px] relative shrink-0 w-[8.63px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.024 15.5">
              <g id="Group 19">
                <path d={svgPaths.p3325c100} fill="var(--fill-0, white)" id="Vector 5" />
                <line id="Line 1" stroke="var(--stroke-0, black)" strokeLinecap="round" x1="9.51221" x2="9.51221" y1="4.5" y2="11.5" />
                <line id="Line 2" stroke="var(--stroke-0, black)" strokeLinecap="round" x1="4.51221" x2="4.51221" y1="4.5" y2="11.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>);

}




function SidebarPlaylistImage({ additionalClassNames = "" }) {
  return (
    <div className={clsx("absolute left-[27px] size-[16px]", additionalClassNames)}>
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgPlaylist} />
    </div>);

}





function SidebarText({ text, additionalClassNames = "" }) {
  return (
    <div className={clsx("absolute content-stretch flex items-center left-[43px] p-[10px]", additionalClassNames)}>
      <p className="font-['Neue_Montreal:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">{text}</p>
    </div>);

}





function Group({ className, property1 = "Default" }) {
  const isDefault = property1 === "Default";
  const isVariant2 = property1 === "Variant2";
  return (
    <div className={className || `relative size-[42px] ${isVariant2 ? "shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)]" : "shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"}`}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        {isDefault &&
        <>
            <g filter="url(#filter0_n_1_487)" id="Ellipse 3">
              <circle cx="21" cy="21" fill="var(--fill-0, black)" r="21" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42" id="filter0_n_1_487" width="42" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feTurbulence baseFrequency="inf inf" numOctaves="3" result="noise" seed="513" stitchTiles="stitch" type="fractalNoise" />
                <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
                <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                  <feFuncA tableValues="0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" type="discrete" />
                </feComponentTransfer>
                <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
                <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
                <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
                <feMerge result="effect1_noise_1_487">
                  <feMergeNode in="shape" />
                  <feMergeNode in="color1" />
                </feMerge>
              </filter>
            </defs>
          </>
        }
        {isVariant2 && <circle cx="21" cy="21" fill="var(--fill-0, black)" id="Ellipse 3" r="21" />}
      </svg>
      <div className="absolute flex inset-[33.73%_30.95%_36.11%_30.95%] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[12.667px] rotate-180 w-[16px]">
          <div className="relative size-full">
            <div className="absolute inset-[-7.89%_-6.25%_-7.89%_-9.08%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4524 14.6667">
                <path d={isVariant2 ? svgPaths.p2e466100 : svgPaths.p209fd80} id="Vector 2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_-2px_5.5px_0px_rgba(106,106,106,0.25),inset_-2px_2px_4.8px_0px_rgba(255,255,255,0.17)]" />
    </div>);

}

export default function HomeScreen() {
  return (
    <div className="bg-[#0e0e0e] relative size-full" data-name="home_screen">
      <div className="absolute h-[917px] left-[243px] rounded-[16px] top-[15px] w-[1470px]" data-name="home_screen">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgHomeScreen} />
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <p className="absolute capitalize font-['Neue_Montreal:Italic',sans-serif] italic leading-[normal] left-[42px] text-[#f5f5f5] text-[48px] top-[109px] whitespace-nowrap">hello user</p>
          <p className="-translate-x-1/2 absolute capitalize font-['Neue_Montreal:Italic',sans-serif] italic leading-[normal] left-[133px] text-[#a1a1a1] text-[32px] text-center top-[164px] w-[204px]">21st of March</p>
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[31px] top-[219px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[31px] top-[510px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[250px] top-[219px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[250px] top-[510px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[469px] top-[219px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[469px] top-[510px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[688px] top-[219px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[688px] top-[510px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[907px] top-[219px]" />
          <VinylPlayerPhotoText text="Before I Stay" additionalClassNames="left-[907px] top-[510px]" />
          <Group className="absolute left-[95px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[42px] top-[35px]" />
          <div className="absolute flex items-center justify-center left-[41px] size-[42px] top-[35px]">
            <div className="-scale-y-100 flex-none rotate-180">
              <Group className="relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[42px]" />
            </div>
          </div>
          <div className="absolute backdrop-blur-[3.6px] bg-[rgba(0,0,0,0.67)] border-2 border-[rgba(255,255,255,0.21)] border-solid h-[881px] left-[1133px] overflow-clip rounded-[10px] top-[18px] w-[319px]">
            <div className="absolute aspect-[314/301] left-[calc(7.21%-1.71px)] pointer-events-none right-[calc(6.9%-1.72px)] rounded-[9px] top-[18px]" data-name="image 9">
              <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[9px] size-full" src={imgImage9} />
              <div aria-hidden="true" className="absolute border-4 border-[rgba(255,255,255,0.25)] border-solid inset-0 rounded-[9px]" />
            </div>
            <p className="absolute capitalize font-['Neue_Montreal:Bold',sans-serif] leading-[normal] left-[21px] not-italic text-[32px] text-white top-[296px] whitespace-nowrap">summer Love</p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <div className="absolute flex h-[155px] items-center justify-center left-[243px] top-[947px] w-[1470px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "108" }}>
        <div className="-rotate-90 flex-none">
          <div className="bg-gradient-to-l from-[#202020] h-[1470px] overflow-clip relative rounded-[16px] to-black w-[155px]" data-name="player">
            <div className="absolute flex h-[679px] items-center justify-center left-[78px] top-[386px] w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" }}>
              <div className="flex-none rotate-90">
                <div className="h-0 relative w-[679px]">
                  <div className="absolute inset-[-8px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 679 8">
                      <line id="Line 3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="8" x1="4" x2="675" y1="4" y2="4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute flex h-[16px] items-center justify-center left-[65px] top-[403px] w-[33px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" }}>
              <div className="flex-none rotate-90">
                <div className="bg-[red] border border-black border-solid h-[33px] rounded-[15px] w-[16px]" />
              </div>
            </div>
            <PlayerText text="0:00" additionalClassNames="h-[51px] top-[385px]" />
            <PlayerText text="3:54" additionalClassNames="h-[46px] top-[1015px]" />
            <div className="absolute aspect-[122/127] flex items-center justify-center left-[10.97%] right-[10.32%] top-[23px]">
              <div className="flex-none h-[122px] rotate-90 w-[127px]">
                <div className="pointer-events-none relative rounded-[13px] size-full" data-name="image 9">
                  <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[13px] size-full" src={imgImage9} />
                  <div aria-hidden="true" className="absolute border-4 border-[rgba(255,255,255,0.25)] border-solid inset-0 rounded-[13px]" />
                </div>
              </div>
            </div>
            <div className="absolute contents h-[146px] left-[110px] top-[385px] w-[17px]">
              <div className="absolute flex h-[146px] items-center justify-center left-[110px] top-[385px] w-[17px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" }}>
                <div className="flex-none rotate-90">
                  <p className="capitalize font-['Neue_Montreal:Medium',sans-serif] leading-[normal] not-italic relative text-[24.264px] text-white whitespace-nowrap">Summer Love</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[#2f2f2f] h-[1087px] left-[15px] overflow-clip rounded-[16px] to-[95.192%] to-black top-[15px] w-[213px]" data-name="sidebar">
        <div className="absolute h-[32px] left-[121px] top-[16px] w-[76px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 32">
            <g id="Group 18">
              <circle cx="60" cy="16" fill="var(--fill-0, black)" id="Ellipse 5" r="16" />
              <circle cx="16" cy="16" fill="var(--fill-0, black)" id="Ellipse 6" r="16" />
              <path d={svgPaths.p13d8c480} fill="var(--stroke-0, white)" id="Vector 2" />
              <path d={svgPaths.p20b66780} fill="var(--stroke-0, white)" id="Vector 3" />
            </g>
          </svg>
        </div>
        <div className="absolute bg-[#2f2f2f] content-stretch flex gap-[10px] h-[44px] items-center justify-end left-[9px] pr-[84px] rounded-[25px] top-[73px] w-[195px]">
          <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[25px]" />
          <div className="relative shrink-0 size-[20.644px]" data-name="Search">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgSearch} />
          </div>
          <p className="font-['Neue_Montreal:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[19.156px] text-white whitespace-nowrap">search</p>
        </div>
        <p className="absolute font-['Neue_Montreal:Medium',sans-serif] leading-[normal] left-[16px] not-italic opacity-50 text-[12px] text-white top-[161px] uppercase whitespace-nowrap">menu</p>
        <div className="absolute font-['Neue_Montreal:Medium',sans-serif] h-[249.603px] leading-[normal] left-[16px] not-italic text-[35.95px] text-white top-[214px] w-[137px] whitespace-nowrap" data-name="Component 6">
          <p className="absolute inset-[0_32.88%_89.47%_1.37%]">home</p>
          <p className="absolute inset-[21.05%_0_68.42%_1.37%]">discover</p>
          <p className="absolute inset-[43.61%_41.1%_45.86%_0]">radio</p>
          <p className="absolute inset-[64.66%_15.07%_24.81%_1.37%]">albums</p>
          <p className="absolute inset-[89.47%_34.25%_0_1.37%]">blend</p>
        </div>
        <p className="absolute font-['Neue_Montreal:Medium',sans-serif] leading-[normal] left-[16px] not-italic opacity-50 text-[12px] text-white top-[526px] whitespace-nowrap">PLAYLISTS</p>
        <SidebarText text="TOP HITS 2026" additionalClassNames="top-[564px]" />
        <SidebarText text="FAVORITE" additionalClassNames="top-[603px] w-[103px]" />
        <SidebarText text="CAR MUSIC" additionalClassNames="top-[642px] w-[103px]" />
        <SidebarPlaylistImage additionalClassNames="top-[570px]" />
        <SidebarPlaylistImage additionalClassNames="top-[609px]" />
        <SidebarPlaylistImage additionalClassNames="top-[648px]" />
        <SidebarHelper additionalClassNames="top-[570px]" />
        <SidebarHelper additionalClassNames="top-[608px]" />
        <SidebarHelper additionalClassNames="top-[647px]" />
      </div>
    </div>);

}