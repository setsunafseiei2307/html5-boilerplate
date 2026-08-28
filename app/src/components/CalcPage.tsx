import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AGE_BANDS,
  OCCASIONS,
  OCCASION_MAP,
  REGIONS,
  relationsFor
} from '../lib/occasions';
import { isValidInput } from '../lib/amount';
import { buildCalcHash } from '../lib/share';
import type { AttendanceId, GiftInput, OccasionId, RelationId } from '../lib/types';
import { IconAlert, IconArrow, IconCheck, OccasionIcon } from './icons';

const STEP_NAMES = ['場面', '相手', '自分の条件'];

const ATTENDANCE_OPTIONS: { id: AttendanceId; label: string }[] = [
  { id: 'attend', label: '出席する' },
  { id: 'absent_before', label: '事前に欠席を伝えた' },
  { id: 'absent_sameday', label: '当日に欠席した' }
];

export interface CalcPageProps {
  initial: Partial<GiftInput>;
  onSubmit: (input: GiftInput) => void;
}

export default function CalcPage({ initial, onSubmit }: CalcPageProps) {
  const [occasion, setOccasion] = useState<OccasionId | undefined>(initial.occasion);
  const [relation, setRelation] = useState<RelationId | undefined>(initial.relation);
  const [age, setAge] = useState(initial.age ?? '30s');
  const [region, setRegion] = useState(initial.region ?? 'national');
  const [attendance, setAttendance] = useState<AttendanceId>(initial.attendance ?? 'attend');
  const [joint, setJoint] = useState(initial.joint ?? false);
  const [step, setStep] = useState(() => (initial.occasion ? (initial.relation ? 2 : 1) : 0));
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLLegendElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  // 選択の手応えを見せてから次の手順へ送る
  const advanceAfter = (nextStep: number) => {
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => setStep(nextStep), 280);
  };

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  const currentOccasion = occasion ? OCCASION_MAP[occasion] : undefined;
  const relationOptions = useMemo(
    () => (occasion ? relationsFor(occasion) : []),
    [occasion]
  );

  // 場面を変えたとき、その場面に存在しない関係性は選び直してもらう
  useEffect(() => {
    if (relation && relationOptions.every((r) => r.id !== relation)) {
      setRelation(undefined);
    }
  }, [relation, relationOptions]);

  // 手順が進んだら見出しにフォーカスを移し、読み上げと視線を追従させる
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const ceremony = currentOccasion?.ceremony ?? 'celebration';

  const goNext = () => {
    if (step === 0) {
      if (!occasion) {
        setError('場面が選ばれていません。どのお祝い・お悔やみか、ひとつ選んでください。');
        return;
      }
      setError(null);
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!relation) {
        setError(
          '相手との関係が選ばれていません。金額は関係性でいちばん大きく変わるため、省略できません。'
        );
        return;
      }
      setError(null);
      setStep(2);
      return;
    }
    const draft: Partial<GiftInput> = { occasion, relation, age, region, attendance, joint };
    if (!isValidInput(draft)) {
      setError('入力が揃っていません。前の手順に戻って、場面と相手を選び直してください。');
      return;
    }
    setError(null);
    onSubmit(draft);
  };

  const goBack = () => {
    window.clearTimeout(advanceTimer.current);
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="wizard" data-ceremony={ceremony}>
      <nav className="steps" aria-label="入力の手順">
        {STEP_NAMES.map((name, index) => (
          <div
            className={`step${index === step ? ' step--active' : ''}${
              index < step ? ' step--done' : ''
            }`}
            key={name}
          >
            <button
              type="button"
              className="step__dot"
              disabled={index >= step}
              aria-label={`手順${index + 1}「${name}」に戻る`}
              onClick={() => {
                window.clearTimeout(advanceTimer.current);
                setError(null);
                setStep(index);
              }}
            >
              {index < step ? <IconCheck size={13} /> : index + 1}
            </button>
            <span className="step__name">{name}</span>
            {index < STEP_NAMES.length - 1 ? <span className="step__bar" /> : null}
          </div>
        ))}
      </nav>

      {step > 0 && currentOccasion ? (
        <div className="summary-bar">
          <span className="summary-pill">
            場面 <b>{currentOccasion.label}</b>
          </span>
          {relation && step > 1 ? (
            <span className="summary-pill">
              相手 <b>{relationOptions.find((r) => r.id === relation)?.label}</b>
            </span>
          ) : null}
        </div>
      ) : null}

      <fieldset className="fieldset">
        {step === 0 ? (
          <>
            <legend className="field-legend" ref={headingRef} tabIndex={-1}>
              どんな場面ですか
            </legend>
            <p className="field-help">
              お祝いかお悔やみかで、金額の考え方も袋の選び方も変わります。選ぶと次へ進みます。
            </p>
            <div className="option-grid">
              {OCCASIONS.map((item) => (
                <button
                  type="button"
                  className="option"
                  key={item.id}
                  aria-pressed={occasion === item.id}
                  onClick={() => {
                    setOccasion(item.id);
                    setError(null);
                    advanceAfter(1);
                  }}
                >
                  <span className="option__icon">
                    <OccasionIcon name={item.icon} size={22} />
                  </span>
                  <span className="option__body">
                    <span className="option__title">{item.label}</span>
                    <span className="option__sub">{item.caption}</span>
                  </span>
                  <span className="option__check" aria-hidden>
                    <IconCheck size={16} />
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <legend className="field-legend" ref={headingRef} tabIndex={-1}>
              相手はどなたですか
            </legend>
            <p className="field-help">
              あなたから見た関係を選んでください。金額はここでいちばん大きく変わります。
            </p>
            <div className="option-grid option-grid--tight">
              {relationOptions.map((item) => (
                <button
                  type="button"
                  className="option"
                  key={item.id}
                  aria-pressed={relation === item.id}
                  onClick={() => {
                    setRelation(item.id);
                    setError(null);
                    advanceAfter(2);
                  }}
                >
                  <span className="option__body">
                    <span className="option__title">{item.label}</span>
                    <span className="option__sub">{item.hint}</span>
                  </span>
                  <span className="option__check" aria-hidden>
                    <IconCheck size={16} />
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <legend className="field-legend" ref={headingRef} tabIndex={-1}>
              あなたの条件
            </legend>
            <p className="field-help">
              年代が上がるほど包む額は増えます。地域によっても相場は変わります。
            </p>

            <div className="field-block">
              <span className="field-block__label">あなたの年代</span>
              <div className="segment" role="group" aria-label="あなたの年代">
                {AGE_BANDS.map((band) => (
                  <button
                    type="button"
                    className="segment__item"
                    key={band.id}
                    aria-pressed={age === band.id}
                    onClick={() => setAge(band.id)}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-block">
              <span className="field-block__label">地域</span>
              <div className="segment" role="group" aria-label="地域">
                {REGIONS.map((item) => (
                  <button
                    type="button"
                    className="segment__item"
                    key={item.id}
                    aria-pressed={region === item.id}
                    onClick={() => setRegion(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {currentOccasion?.asksAttendance ? (
              <div className="field-block">
                <span className="field-block__label">式への出欠</span>
                <div className="segment" role="group" aria-label="式への出欠">
                  {ATTENDANCE_OPTIONS.map((item) => (
                    <button
                      type="button"
                      className="segment__item"
                      key={item.id}
                      aria-pressed={attendance === item.id}
                      onClick={() => setAttendance(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {currentOccasion?.asksJoint ? (
              <div className="field-block">
                <div className="toggle-row">
                  <span className="toggle-row__text">
                    <span className="toggle-row__title">夫婦・連名で包む</span>
                    <span className="toggle-row__sub">
                      二人分をひとつの袋にまとめる場合はこちら
                    </span>
                  </span>
                  <button
                    type="button"
                    className="switch"
                    aria-pressed={joint}
                    aria-label="夫婦・連名で包む"
                    onClick={() => setJoint((v) => !v)}
                  />
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {error ? (
          <p className="formerror" role="alert">
            <IconAlert size={17} />
            <span>{error}</span>
          </p>
        ) : null}

        <div className="wizard__actions">
          {step > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={goBack}>
              戻る
            </button>
          ) : (
            <a className="btn btn--ghost" href="#/">
              やめる
            </a>
          )}
          <button type="button" className="btn btn--accent" onClick={goNext}>
            {step === 2 ? '金額を見る' : '次へ'}
            <IconArrow size={17} />
          </button>
        </div>
      </fieldset>

      <p
        className="lead"
        style={{ marginTop: 24, fontSize: 12.5, textAlign: 'center', opacity: 0.75 }}
      >
        入力内容は端末の外に送信されません。結果はURLに含まれるため、そのまま共有できます。
      </p>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <a className="linkbtn" href={buildCalcHash({}, false)}>
          最初からやり直す
        </a>
      </div>
    </div>
  );
}
