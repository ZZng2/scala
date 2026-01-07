import clsx from "clsx";
type Text2Props = {
  additionalClassNames?: string;
};

function Text2({ children, additionalClassNames = "" }: React.PropsWithChildren<Text2Props>) {
  return (
    <div className={clsx("relative shrink-0 w-[163.147px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">{children}</div>
    </div>
  );
}

function Text() {
  return (
    <Text2 additionalClassNames="h-[18.754px]">
      <p className="font-['Pretendard:Bold',sans-serif] leading-[18.75px] not-italic relative shrink-0 text-[15px] text-nowrap text-white">정보가 임시 저장 중이에요!</p>
    </Text2>
  );
}

function Text1() {
  return (
    <Text2 additionalClassNames="h-[13.75px] opacity-90">
      <p className="font-['Pretendard:Regular',sans-serif] leading-[13.75px] not-italic relative shrink-0 text-[11px] text-nowrap text-white">카카오로 3초 만에 가입하고 알림 받기</p>
    </Text2>
  );
}

function Container() {
  return (
    <div className="h-[34.495px] relative shrink-0 w-[163.147px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.991px] items-start justify-center relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[31.998px] relative rounded-[2.36215e+07px] shrink-0 w-[72.367px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] py-[8px] relative size-full">
        <p className="font-['Pretendard:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#ff6b35] text-[14px] text-center text-nowrap">가입하기</p>
      </div>
    </div>
  );
}

export default function StickyBar() {
  return (
    <div className="bg-gradient-to-b from-[#ff6b35] relative size-full to-[#ff8c5a]" data-name="StickyBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[15.993px] py-0 relative size-full">
          <Container />
          <Button />
        </div>
      </div>
    </div>
  );
}