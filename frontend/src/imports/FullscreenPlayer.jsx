import clsx from "clsx";
import svgPaths from "./svg-1g5gwzgzym";
import imgSearch from "figma:asset/8f8a4715a798d8de592e2c396ea0aa59e383f475.png";
import imgPlaylist from "figma:asset/dba3af193df85a07d3dfce7a5985ca67bf84e1a0.png";
import imgImage5 from "figma:asset/0bfdc41084da15b3aa5fbf86beb803f13cfc97d6.png";
import imgObject from "figma:asset/4e781fbd7ba08aabd8a0534fcd5d68a20942a416.png";
import imgObject1 from "figma:asset/deddf06fa0356a4efc62b5f02fc60ab37eb1fa30.png";




function FullscreenPlayerBackgroundImage({ children, additionalClassNames = "" }) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="relative size-full" data-name="Object">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">{children}</div>
      </div>
    </div>);

}

function BackgroundImage({ children }) {
  return (
    <div className="absolute flex inset-[33.73%_30.95%_36.11%_30.95%] items-center justify-center">
      <div className="-scale-y-100 flex-none h-[12.667px] rotate-180 w-[16px]">
        <div className="relative size-full">
          <div className="absolute inset-[-7.89%_-6.25%_-7.89%_-9.08%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4524 14.6667">
              {children}
            </svg>
          </div>
        </div>
      </div>
    </div>);

}





function FullscreenPlayerBackgroundImageAndText({ text, additionalClassNames = "" }) {
  return (
    <div className={clsx("flex-none h-[12.419px]", additionalClassNames)}>
      <p className="capitalize font-['PP_NeueBit:Bold',sans-serif] leading-[100.05999755859375%] not-italic relative text-[24.84px] text-center text-white tracking-[0.4968px] whitespace-nowrap">{text}</p>
    </div>);

}





function BackgroundImageAndText({ text, additionalClassNames = "" }) {
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




function SidebarBackgroundImage({ additionalClassNames = "" }) {
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




function SidebarPlaylistBackgroundImage({ additionalClassNames = "" }) {
  return (
    <div className={clsx("absolute left-[27px] size-[16px]", additionalClassNames)}>
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgPlaylist} />
    </div>);

}





function SidebarBackgroundImageAndText({ text, additionalClassNames = "" }) {
  return (
    <div className={clsx("absolute content-stretch flex items-center left-[43px] p-[10px]", additionalClassNames)}>
      <p className="font-['Neue_Montreal:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">{text}</p>
    </div>);

}

function HelpersvgBackgroundImage() {
  return (
    <defs>
      <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42" id="filter0_n_1_511" width="42" x="0" y="0">
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
        <feMerge result="effect1_noise_1_511">
          <feMergeNode in="shape" />
          <feMergeNode in="color1" />
        </feMerge>
      </filter>
    </defs>);

}





function Group({ className, property1 = "Default" }) {
  const isDefault = property1 === "Default";
  const isVariant2 = property1 === "Variant2";
  return (
    <div className={className || `relative size-[42px] ${isVariant2 ? "shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)]" : "shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"}`}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        {isDefault &&
        <>
            <g filter="url(#filter0_n_1_511)" id="Ellipse 3">
              <circle cx="21" cy="21" fill="var(--fill-0, black)" r="21" />
            </g>
            <HelpersvgBackgroundImage />
          </>
        }
        {isVariant2 && <circle cx="21" cy="21" fill="var(--fill-0, black)" id="Ellipse 3" r="21" />}
      </svg>
      <BackgroundImage>
        <path d={isVariant2 ? svgPaths.p2e466100 : svgPaths.p209fd80} id="Vector 2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
      </BackgroundImage>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_-2px_5.5px_0px_rgba(106,106,106,0.25),inset_-2px_2px_4.8px_0px_rgba(255,255,255,0.17)]" />
    </div>);

}

export default function FullscreenPlayer() {
  return (
    <div className="bg-[#0e0e0e] relative size-full" data-name="fullscreen_player">
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
        <SidebarBackgroundImageAndText text="TOP HITS 2026" additionalClassNames="top-[564px]" />
        <SidebarBackgroundImageAndText text="FAVORITE" additionalClassNames="top-[603px] w-[103px]" />
        <SidebarBackgroundImageAndText text="CAR MUSIC" additionalClassNames="top-[642px] w-[103px]" />
        <SidebarPlaylistBackgroundImage additionalClassNames="top-[570px]" />
        <SidebarPlaylistBackgroundImage additionalClassNames="top-[609px]" />
        <SidebarPlaylistBackgroundImage additionalClassNames="top-[648px]" />
        <SidebarBackgroundImage additionalClassNames="top-[570px]" />
        <SidebarBackgroundImage additionalClassNames="top-[608px]" />
        <SidebarBackgroundImage additionalClassNames="top-[647px]" />
      </div>
      <div className="absolute bg-[#1a1a1a] h-[747px] left-[243px] overflow-clip rounded-[16px] top-[-761px] w-[1470px]" data-name="home_screen">
        <p className="absolute capitalize font-['Neue_Montreal:Italic',sans-serif] italic leading-[normal] left-[42px] text-[#f5f5f5] text-[48px] top-[109px] whitespace-nowrap">hello user</p>
        <p className="-translate-x-1/2 absolute capitalize font-['Neue_Montreal:Italic',sans-serif] italic leading-[normal] left-[133px] text-[#a1a1a1] text-[32px] text-center top-[164px] w-[204px]">21st of March</p>
        <BackgroundImageAndText text="Before I Stay" additionalClassNames="left-[35px] top-[254px]" />
        <BackgroundImageAndText text="Before I Stay" additionalClassNames="left-[289px] top-[253px]" />
        <BackgroundImageAndText text="Before I Stay" additionalClassNames="left-[543px] top-[252px]" />
        <BackgroundImageAndText text="Before I Stay" additionalClassNames="left-[797px] top-[251px]" />
        <BackgroundImageAndText text="Before I Stay" additionalClassNames="left-[1051px] top-[250px]" />
        <Group className="absolute left-[95px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[42px] top-[35px]" />
        <div className="absolute flex items-center justify-center left-[41px] size-[42px] top-[35px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Group className="relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[42px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[1087px] items-center justify-center left-[243px] top-[15px] w-[1473px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "238" }}>
        <div className="-rotate-90 flex-none">
          <div className="h-[1473px] overflow-clip relative rounded-[16px] w-[1087px]" data-name="player" style={{ backgroundImage: "linear-gradient(212.811deg, rgb(31, 31, 31) 0%, rgb(62, 62, 62) 93.321%)" }}>
            <div className="absolute flex items-center justify-center left-[1010px] size-[42px] top-[41px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "43" }}>
              <div className="-rotate-90 -scale-y-100 flex-none">
                <div className="relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[42px]" data-name="backward">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
                    <g filter="url(#filter0_n_1_511)" id="Ellipse 3">
                      <circle cx="21" cy="21" fill="var(--fill-0, black)" r="21" />
                    </g>
                    <HelpersvgBackgroundImage />
                  </svg>
                  <BackgroundImage>
                    <path d={svgPaths.p209fd80} id="Vector 2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
                  </BackgroundImage>
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_-2px_5.5px_0px_rgba(106,106,106,0.25),inset_-2px_2px_4.8px_0px_rgba(255,255,255,0.17)]" />
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute aspect-[988.3524604400591/1132.3372872301043] flex items-center justify-center left-[12.39%] right-[-3.31%] top-[calc(50%+104.17px)]">
              <FullscreenPlayerBackgroundImage additionalClassNames="h-[736px] rotate-[107.42deg] w-[955.871px]">
                <img alt="" className="absolute h-[99.89%] left-[0.1%] max-w-none top-[0.06%] w-[99.88%]" src={imgObject} />
              </FullscreenPlayerBackgroundImage>
            </div>
            <div className="absolute flex inset-[6.82%_71.11%_84.18%_13.48%] items-center justify-center">
              <FullscreenPlayerBackgroundImage additionalClassNames="h-[167.438px] rotate-90 w-[141px]">
                <img alt="" className="absolute h-[99.52%] left-[1.46%] max-w-none top-[0.26%] w-[98.48%]" src={imgObject1} />
              </FullscreenPlayerBackgroundImage>
            </div>
            <div className="absolute flex h-[157.314px] items-center justify-center left-[758.5px] top-[81px] w-[157.501px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "130" }}>
              <div className="flex-none rotate-[89.16deg]">
                <div className="h-[155.235px] relative w-[155.045px]">
                  <div className="absolute h-[calc(100%-7%+0px)] inset-[7%_9.89%_0_14.02%] pointer-events-none">
                    <div className="pointer-events-auto sticky top-0">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 117.979 117.979">
                        <g filter="url(#filter0_ii_1_505)" id="Ellipse 7">
                          <circle cx="58.9894" cy="58.9894" fill="var(--fill-0, #5F5F5F)" r="58.9894" />
                        </g>
                        <defs>
                          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="128.845" id="filter0_ii_1_505" width="127.293" x="-3.10471" y="-6.20941">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                            <feOffset dx="-3.10471" dy="4.65706" />
                            <feGaussianBlur stdDeviation="6.5975" />
                            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.48 0" />
                            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_505" />
                            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                            <feOffset dx="6.20941" dy="-6.20941" />
                            <feGaussianBlur stdDeviation="5.35562" />
                            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.673077 0 0 0 0 0.673077 0 0 0 0 0.673077 0 0 0 0.37 0" />
                            <feBlend in2="effect1_innerShadow_1_505" mode="normal" result="effect2_innerShadow_1_505" />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-[15%_44.93%_79%_49.06%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.31412 9.31412">
                      <g id="Ellipse 8">
                        <circle cx="4.65706" cy="4.65706" fill="var(--fill-0, #00FF09)" r="4.65706" />
                        <circle cx="4.65706" cy="4.65706" r="3.88088" stroke="var(--stroke-0, black)" strokeOpacity="0.52" strokeWidth="1.55235" />
                      </g>
                    </svg>
                  </div>
                  <div className="absolute inset-[0_17.9%_86%_20.02%]">
                    <div className="absolute inset-[-3.57%_-1.73%_-3.57%_-1.76%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 99.6023 23.2854">
                        <path d={svgPaths.p3ceeeb00} fill="var(--stroke-0, white)" id="Line 5" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute flex inset-[18%_83.09%_57.76%_0] items-center justify-center">
                    <FullscreenPlayerBackgroundImageAndText text="OFF" additionalClassNames="rotate-[-65.27deg] w-[35.704px]" />
                  </div>
                  <div className="absolute flex inset-[12%_0_70.14%_85.1%] items-center justify-center">
                    <FullscreenPlayerBackgroundImageAndText text="oN" additionalClassNames="rotate-[60.3deg] w-[24.838px]" />
                  </div>
                  <p className="absolute capitalize font-['PP_NeueBit:Bold',sans-serif] inset-[92%_27.91%_0_31.04%] leading-[100.05999755859375%] not-italic text-[24.84px] text-center text-white tracking-[0.4968px] whitespace-nowrap">POWER</p>
                </div>
              </div>
            </div>
            <div className="absolute flex h-[74px] items-center justify-center left-[39.21px] top-[1262px] w-[418.791px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" }}>
              <div className="flex-none rotate-90">
                <div className="bg-black h-[418.791px] relative w-[74px]" data-name="volume_knob">
                  <div className="relative size-full">
                    <div className="absolute bg-black border-[#616161] border-[0.813px] border-solid h-[375.692px] left-[31.71px] shadow-[0px_0px_19.11px_7.319px_rgba(80,80,80,0.51)] top-[18.7px] w-[11.385px]" data-name="slider" />
                    <div className="absolute bg-gradient-to-b from-[#151515] h-[48.791px] left-[10.57px] rounded-[8.945px] to-[#323232] top-[185.41px] w-[52.857px]" data-name="slider_knob">
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-4.066px_2.196px_0px_rgba(0,0,0,0.37),inset_-3.253px_2.44px_7.319px_0px_rgba(255,255,255,0.09)]" />
                    </div>
                  </div>
                  <div aria-hidden="true" className="absolute border-[#5f5f5f] border-[3.253px] border-solid inset-0 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="absolute flex h-[74px] items-center justify-center left-[39.21px] top-[1358px] w-[418.791px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" }}>
              <div className="flex-none rotate-90">
                <div className="h-[418.791px] relative w-[74px]" data-name="volume_knob">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74 418.791">
                    <g id="volume_knob">
                      <g clipPath="url(#clip0_1_507)">
                        <rect fill="var(--fill-0, black)" height="418.791" width="74" />
                        <g filter="url(#filter0_d_1_507)" id="slider">
                          <rect fill="var(--fill-0, black)" height="375.692" width="11.3846" x="31.7143" y="18.7033" />
                          <rect height="374.879" stroke="var(--stroke-0, #616161)" strokeWidth="0.813187" width="10.5714" x="32.1209" y="19.1099" />
                        </g>
                        <g filter="url(#filter1_ii_1_507)" id="slider_knob">
                          <path d={svgPaths.p1d70c6f0} fill="url(#paint0_linear_1_507)" />
                        </g>
                      </g>
                      <rect height="415.538" stroke="var(--stroke-0, white)" strokeWidth="3.25275" width="70.7473" x="1.62637" y="1.62637" />
                      <rect height="415.538" stroke="url(#paint1_linear_1_507)" strokeWidth="3.25275" width="70.7473" x="1.62637" y="1.62637" />
                    </g>
                    <defs>
                      <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="428.549" id="filter0_d_1_507" width="64.2418" x="5.28571" y="-7.72525">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feMorphology in="SourceAlpha" operator="dilate" radius="7.31868" result="effect1_dropShadow_1_507" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="9.55494" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.315385 0 0 0 0 0.315385 0 0 0 0 0.315385 0 0 0 0.51 0" />
                        <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_507" />
                        <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_507" mode="normal" result="shape" />
                      </filter>
                      <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="53.4264" id="filter1_ii_1_507" width="56.1099" x="7.31868" y="93.3044">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                        <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dx="-3.25275" dy="2.43956" />
                        <feGaussianBlur stdDeviation="3.65934" />
                        <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.09 0" />
                        <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_507" />
                        <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="-4.06593" />
                        <feGaussianBlur stdDeviation="1.0978" />
                        <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.37 0" />
                        <feBlend in2="effect1_innerShadow_1_507" mode="normal" result="effect2_innerShadow_1_507" />
                      </filter>
                      <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_507" x1="37" x2="37" y1="185.407" y2="234.198">
                        <stop stopColor="#151515" />
                        <stop offset="1" stopColor="#323232" />
                      </linearGradient>
                      <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_507" x1="-7.72528" x2="90.6703" y1="-12.1978" y2="446.44">
                        <stop stopColor="#5F5F5F" />
                        <stop offset="0.485577" stopColor="#262626" />
                        <stop offset="1" stopColor="#494949" />
                      </linearGradient>
                      <clipPath id="clip0_1_507">
                        <rect fill="white" height="418.791" width="74" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}