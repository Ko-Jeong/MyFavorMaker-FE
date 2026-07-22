import { type IdolGroup } from "@/types/chart";
import { boynextdoor } from "./boynextdoor";
import { ateez } from "./ateez";

// ▼▼▼ 새 그룹 추가는 여기 두 줄만 ▼▼▼
//   1) 위에 import 추가:  import { newgroup } from "./newgroup";
//   2) 아래 배열에 추가:  newgroup
export const groups: IdolGroup[] = [boynextdoor, ateez];
// ▲▲▲ 목록/불러오기는 아래에서 자동 생성됩니다 ▲▲▲

/** 불러오기 화면용 목록 (데이터에서 자동 파생) */
export const chartList = groups.map(({ id, title }) => ({ id, title }));

/** id로 그룹 명단 하나 찾기 */
export const getGroup = (id: string): IdolGroup | undefined =>
  groups.find((g) => g.id === id);
