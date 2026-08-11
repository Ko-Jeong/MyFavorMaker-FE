import { type IdolGroup } from "@/types/chart";

import { aen } from "./aen";
import { aespa } from "./aespa";
import { ald1 } from "./ald1";
import { and2ble } from "./and2ble";
import { andteam } from "./andteam";
import { ateez } from "./ateez";
import { babymonster } from "./babymonster";
import { blackpink } from "./blackpink";
import { boynextdoor } from "./boynextdoor";
import { bts } from "./bts";
import { closeyoureyes } from "./closeyoureyes";
import { cortis } from "./cortis";
import { cravity } from "./cravity";
import { day6 } from "./day6";
import { enhypen } from "./enhypen";
import { exo } from "./exo";
import { flareu } from "./flareu";
import { hearts2hearts } from "./hearts2hearts";
import { idid } from "./idid";
import { idntt } from "./idntt";
import { illit } from "./illit";
import { itzy } from "./itzy";
import { izna } from "./izna";
import { kickflip } from "./kickflip";
import { kiiikiii } from "./kiiikiii";
import { lesserafim } from "./lesserafim";
import { lngshot } from "./lngshot";
import { major82 } from "./major82";
import { mamamoo } from "./mamamoo";
import { monstax } from "./monstax";
import { nct127 } from "./nct127";
import { nctdream } from "./nctdream";
import { nctwish } from "./nctwish";
import { newjeans } from "./newjeans";
import { p1h } from "./p1h";
import { redvelvet } from "./redvelvet";
import { rescene } from "./rescene";
import { riize } from "./riize";
import { seventeen } from "./seventeen";
import { straykids } from "./straykids";
import { theboyz } from "./theboyz";
import { treasure } from "./treasure";
import { triples } from "./triples";
import { twice } from "./twice";
import { tws } from "./tws";
import { txt } from "./txt";
import { xdinaryheroes } from "./xdinaryheroes";
import { zb1 } from "./zb1";

// ▼▼▼ 새 그룹 추가는 여기 두 줄만 ▼▼▼
//   1) 위에 import 추가:  import { newgroup } from "./newgroup";
//   2) 아래 배열에 추가:  newgroup
export const groups: IdolGroup[] = [
  aen,
  aespa,
  ald1,
  and2ble,
  andteam,
  ateez,
  babymonster,
  blackpink,
  boynextdoor,
  bts,
  closeyoureyes,
  cortis,
  cravity,
  day6,
  enhypen,
  exo,
  flareu,
  hearts2hearts,
  idid,
  idntt,
  illit,
  itzy,
  izna,
  kickflip,
  kiiikiii,
  lesserafim,
  lngshot,
  major82,
  mamamoo,
  monstax,
  nct127,
  nctdream,
  nctwish,
  newjeans,
  p1h,
  redvelvet,
  rescene,
  riize,
  seventeen,
  straykids,
  theboyz,
  treasure,
  triples,
  twice,
  tws,
  txt,
  xdinaryheroes,
  zb1,
];
// ▲▲▲ 목록/불러오기는 아래에서 자동 생성됩니다 ▲▲▲

/** 불러오기 화면용 목록 (사전순 ABC 정렬) */
export const chartList = groups
  .map(({ id, title }) => ({ id, title }))
  .sort((a, b) => a.title.localeCompare(b.title, "en"));

/** id로 그룹 명단 하나 찾기 */
export const getGroup = (id: string): IdolGroup | undefined =>
  groups.find((g) => g.id === id);
