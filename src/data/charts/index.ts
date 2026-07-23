import { type IdolGroup } from "@/types/chart";

import { boynextdoor } from "./boynextdoor";
import { idid } from "./idid";
import { cortis } from "./cortis";
import { major82 } from "./major82";
import { izna } from "./izna";
import { hearts2hearts } from "./hearts2hearts";
import { rescene } from "./rescene";
import { ateez } from "./ateez";
import { bts } from "./bts";
import { illit } from "./illit";
import { newjeans } from "./newjeans";
import { nct127 } from "./nct127";
import { nctdream } from "./nctdream";
import { nctwish } from "./nctwish";
import { txt } from "./txt";
import { twice } from "./twice";
import { blackpink } from "./blackpink";
import { redvelvet } from "./redvelvet";
import { monstax } from "./monstax";
import { straykids } from "./straykids";
import { theboyz } from "./theboyz";
import { riize } from "./riize";
import { aespa } from "./aespa";
import { seventeen } from "./seventeen";
import { day6 } from "./day6";

// ▼▼▼ 새 그룹 추가는 여기 두 줄만 ▼▼▼
//   1) 위에 import 추가:  import { newgroup } from "./newgroup";
//   2) 아래 배열에 추가:  newgroup
export const groups: IdolGroup[] = [
  boynextdoor,
  idid,
  cortis,
  major82,
  izna,
  hearts2hearts,
  rescene,
  ateez,
  bts,
  illit,
  newjeans,
  nct127,
  nctdream,
  nctwish,
  txt,
  twice,
  blackpink,
  redvelvet,
  monstax,
  straykids,
  theboyz,
  riize,
  aespa,
  seventeen,
  day6,
];
// ▲▲▲ 목록/불러오기는 아래에서 자동 생성됩니다 ▲▲▲

/** 불러오기 화면용 목록 (사전순 ABC 정렬) */
export const chartList = groups
  .map(({ id, title }) => ({ id, title }))
  .sort((a, b) => a.title.localeCompare(b.title, "en"));

/** id로 그룹 명단 하나 찾기 */
export const getGroup = (id: string): IdolGroup | undefined =>
  groups.find((g) => g.id === id);
