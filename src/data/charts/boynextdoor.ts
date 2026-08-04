import { type IdolGroup } from "@/types/chart";

// 그룹 1개 = 파일 1개. 멤버는 이름(+사진)만 적으면 됩니다.
// 왼/른 비율·코멘트는 불러온 뒤 편집 화면에서 수정합니다.
export const boynextdoor: IdolGroup = {
  id: "boynextdoor",
  title: "BOYNEXTDOOR",
  members: [
    { name: "성호", photoUrl: "/photos/boynextdoor/1.jpg" },
    { name: "리우", photoUrl: "/photos/boynextdoor/2.jpg" },
    { name: "재현", photoUrl: "/photos/boynextdoor/3.jpg" },
    { name: "태산", photoUrl: "/photos/boynextdoor/4.jpg" },
    { name: "이한", photoUrl: "/photos/boynextdoor/5.jpg" },
    { name: "운학", photoUrl: "/photos/boynextdoor/6.jpg" },
  ],
};
