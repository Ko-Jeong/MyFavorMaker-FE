"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Camera, X } from "lucide-react";
import { type CharacterCard, rightPercent } from "@/types/chart";
import { useChartStore } from "@/store/useChartStore";
import PreferenceSlider from "@/components/ui/PreferenceSlider";
import Card from "@/components/ui/Card";
import MemberPhoto from "@/components/chart/MemberPhoto";

/**
 * 편집용 카드 (editor 화면).
 * 이름 / 사진 업로드 / 왼 퍼센트(숫자 입력) / 코멘트 수정 + 삭제(×).
 * 퍼센트바는 유저가 직접 조절하지 않고, 왼 퍼센트 값에 따라 자동으로 채워집니다.
 */
export default function CharacterCardEdit({ card }: { card: CharacterCard }) {
  const { updateCard, removeCard } = useChartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const nameMeasureRef = useRef<HTMLSpanElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [nameWidth, setNameWidth] = useState<number>(0);
  const displayName = card.name.trim() ? card.name : "name";

  const setLeftPercent = (raw: string) => {
    const n = Number(raw.replace(/[^0-9]/g, ""));
    updateCard(card.id, { leftPercent: Math.max(0, Math.min(100, n || 0)) });
  };

  const setPhoto = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        updateCard(card.id, { photoUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const setComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { currentTarget } = event;
    currentTarget.style.height = "0px";
    currentTarget.style.height = `${currentTarget.scrollHeight}px`;
    updateCard(card.id, { comment: currentTarget.value });
  };

  const stopNameEditOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsEditingName(false);
      event.currentTarget.blur();
    }
  };

  useEffect(() => {
    if (!isEditingName || !nameInputRef.current) return;

    const { current } = nameInputRef;
    current.focus();
    const end = current.value.length;
    current.setSelectionRange(end, end);
  }, [isEditingName]);

  useEffect(() => {
    if (!isEditingComment || !commentTextareaRef.current) return;

    const { current } = commentTextareaRef;
    current.focus();
    current.style.height = "0px";
    current.style.height = `${current.scrollHeight}px`;
    const end = current.value.length;
    current.setSelectionRange(end, end);
  }, [isEditingComment]);

  useEffect(() => {
    if (!nameMeasureRef.current) return;
    setNameWidth(nameMeasureRef.current.offsetWidth);
  }, [card.name]);

  return (
    <Card className="relative">
      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={() => removeCard(card.id)}
        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
        aria-label="카드 삭제"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-3">
        {/* 사진 업로드 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400"
          aria-label="사진 추가"
        >
          {card.photoUrl ? (
            <MemberPhoto
              src={card.photoUrl}
              alt={card.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Camera className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            setPhoto(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="flex-1">
          {/* 이름 */}
          <div className="flex items-center gap-1.5">
            <div className="min-w-0" style={{ width: nameWidth ? `${nameWidth + 2}px` : undefined }}>
              <span
                ref={nameMeasureRef}
                className="pointer-events-none absolute -z-10 whitespace-pre font-semibold opacity-0"
              >
                {displayName}
              </span>
              {isEditingName ? (
                <input
                  ref={nameInputRef}
                  value={card.name}
                  onChange={(e) => updateCard(card.id, { name: e.target.value })}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={stopNameEditOnEnter}
                  className="w-full min-w-0 bg-transparent p-0 font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none"
                  style={{ width: `${Math.max(nameWidth + 2, 12)}px` }}
                  placeholder="name"
                />
              ) : (
                <p
                  className={
                    card.name.trim()
                      ? "truncate font-semibold text-zinc-900"
                      : "truncate font-semibold text-zinc-400"
                  }
                >
                  {displayName}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="shrink-0"
              aria-label="이름 수정"
            >
              <img
                src="/icons/pencil.svg"
                alt=""
                aria-hidden="true"
                className="h-[14px] w-[14px]"
              />
            </button>
          </div>
          {/* 왼/른 퍼센트 텍스트 — 왼 값을 숫자로 입력하면 바가 자동 반영 */}
          <p className="flex items-center gap-1 text-sm text-zinc-500">
            왼
            <input
              value={card.leftPercent}
              onChange={(e) => setLeftPercent(e.target.value)}
              inputMode="numeric"
              className="w-8 border-b border-zinc-300 text-center font-bold text-zinc-500 outline-none focus:border-primary"
            />
            % | 른{" "}
            <span className="font-bold text-zinc-500">{rightPercent(card)}%</span>
          </p>
        </div>
      </div>

      {/* 퍼센트바 (읽기전용, 왼 퍼센트에 따라 자동 반영) */}
      <div className="mt-3">
        <PreferenceSlider leftPercent={card.leftPercent} />
      </div>

      {/* 코멘트 */}
      <div className="mt-3 flex items-start gap-1.5">
        {isEditingComment ? (
          <textarea
            ref={commentTextareaRef}
            value={card.comment ?? ""}
            onChange={setComment}
            onBlur={() => setIsEditingComment(false)}
            rows={1}
            className="w-full resize-none overflow-hidden bg-transparent text-sm text-zinc-600 outline-none"
            placeholder="+ comment"
          />
        ) : (
          <div className="inline-flex items-end gap-1.5 text-sm text-zinc-400">
            <span
              className={
                card.comment?.trim()
                  ? "whitespace-pre-wrap text-zinc-600"
                  : "whitespace-pre-wrap"
              }
            >
              {card.comment?.trim() ? card.comment : "+ comment"}
            </span>
            <button
              type="button"
              onClick={() => setIsEditingComment(true)}
              className="shrink-0"
              aria-label="코멘트 수정"
            >
              <img
                src="/icons/pencil.svg"
                alt=""
                aria-hidden="true"
                className="h-[14px] w-[14px]"
              />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
