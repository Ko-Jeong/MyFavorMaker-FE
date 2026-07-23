// 취향표(Chart)의 데이터 모양을 팀이 여기서 합의합니다.
// 페이지/컴포넌트는 모두 이 타입을 import 해서 사용하세요.

/** 카드 한 장 = 인물/캐릭터 1명 */
export interface CharacterCard {
  id: string;
  /** 사진 URL. 없으면 플레이스홀더 표시 */
  photoUrl?: string;
  /** 이름 */
  name: string;
  /** 왼쪽 퍼센트 (0~100). 오른쪽은 100 - leftPercent 로 계산 */
  leftPercent: number;
  /** 코멘트 (선택) */
  comment?: string;
}

/** 취향표 하나 = 카드 여러 장 */
export interface Chart {
  id: string;
  /** 취향표 제목 (예: "하이큐 취향표") */
  title: string;
  cards: CharacterCard[];
}

// ── 불러오기용: 미리 등록된 그룹 명단 (이름 + 사진만) ──────────────

export interface GroupMember {
  name: string;
  id?: string;
  /** 사진 URL (기능은 추후) */
  photoUrl?: string;
}

/** 미리 등록된 아이돌 그룹 명단 */
export interface IdolGroup {
  id: string;
  title: string;
  members: GroupMember[];
}

/** 그룹 명단 → 편집용 취향표로 변환 (왼% = 0 에서 시작, 코멘트 없음) */
export const groupToChart = (group: IdolGroup): Chart => ({
  id: group.id,
  title: group.title,
  cards: group.members.map((m, i) => ({
    id: m.id ?? `${group.id}-${i}`, // id 없으면 자동 생성
    name: m.name,
    photoUrl: m.photoUrl,
    leftPercent: 0,
    comment: "",
  })),
});

// ── 헬퍼 ─────────────────────────────────────────────────────────

/** 오른쪽 퍼센트는 왼쪽에서 파생 */
export const rightPercent = (card: CharacterCard): number =>
  100 - card.leftPercent;

/** 빈 카드 하나 생성 (왼% = 0 에서 시작) */
export const createEmptyCard = (): CharacterCard => ({
  id: crypto.randomUUID(),
  name: "name",
  leftPercent: 0,
  comment: "",
});
