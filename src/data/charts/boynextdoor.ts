import { type IdolGroup } from "@/types/chart";

// 그룹 1개 = 파일 1개. 멤버는 이름(+사진)만 적으면 됩니다.
// 왼/른 비율·코멘트는 불러온 뒤 편집 화면에서 0부터 입력합니다.
export const boynextdoor: IdolGroup = {
  id: "boynextdoor",
  title: "BOYNEXTDOOR",
  members: [
    { id: "sungho", name: "성호" },
    { id: "riwoo", name: "리우" },
    { id: "jaehyun", name: "재현" },
    { id: "taesan", name: "태산" },
    { id: "leehan", name: "이한" },
    { id: "woonhak", name: "운학" },
  ],
};
