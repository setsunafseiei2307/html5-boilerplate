import { useCallback, useEffect, useState } from 'react';
import HomePage from './components/HomePage';
import CalcPage from './components/CalcPage';
import ResultPage from './components/ResultPage';
import QuizPage from './components/QuizPage';
import QuizResultPage from './components/QuizResultPage';
import GuidePage from './components/GuidePage';
import { Loading, Toast } from './components/common';
import { IconMoon, IconSun } from './components/icons';
import { buildCalcHash, buildQuizResultHash, parseHash, type Route } from './lib/share';
import { isValidInput, formatYen, calcRange } from './lib/amount';
import { OCCASION_MAP, RELATION_MAP } from './lib/occasions';
import { decodeCorrectness, outcomeFromCorrectness } from './lib/quiz';
import { DEFAULT_META, applyMeta, type PageMeta } from './lib/ogp';
import { loadTheme, saveTheme, type ThemePreference } from './lib/storage';
import type { GiftInput } from './lib/types';

/** 画面ごとの title / description。静的ホスティングでできる範囲の出し分け。 */
function metaFor(route: Route): PageMeta {
  if (route.name === 'calc' && route.submitted && isValidInput(route.input)) {
    const occasion = OCCASION_MAP[route.input.occasion];
    const relation = RELATION_MAP[route.input.relation];
    const amount = calcRange(route.input).typical;
    return {
      title: `${occasion.label}・${relation.label}なら${formatYen(amount)} — つつみ帖`,
      description: `${occasion.label}で${relation.label}に包む金額の目安は${formatYen(
        amount
      )}。表書きは「${occasion.omotegaki}」、水引は${
        occasion.knot === 'musubikiri' ? '結び切り' : '蝶結び'
      }。避けるべき金額まで確認できます。`
    };
  }
  if (route.name === 'quizResult') {
    const correctness = decodeCorrectness(route.token);
    if (correctness) {
      const outcome = outcomeFromCorrectness(correctness);
      return {
        title: `マナー偏差値 ${outcome.deviation}「${outcome.rank.title}」 — つつみ帖`,
        description: `10問中${outcome.correctCount}問正解、推定で上位${outcome.percentile}%。冠婚葬祭の作法、あなたはどこまで答えられますか。`
      };
    }
  }
  if (route.name === 'quiz') {
    return {
      title: 'マナー偏差値テスト — つつみ帖',
      description:
        '表書き、薄墨、忌み数、贈ってはいけないもの。冠婚葬祭の作法を全10問で測ります。'
    };
  }
  if (route.name === 'guide') {
    return {
      title: '冠婚葬祭の金額早見表 — つつみ帖',
      description:
        '8つの場面について、関係性と年代ごとの目安を一覧にしました。表書きと水引の基本も添えています。'
    };
  }
  if (route.name === 'calc') {
    return {
      title: 'つつむ金額シミュレーター — つつみ帖',
      description:
        '場面と相手との関係を選ぶだけ。包む金額の目安と、表書き・水引・お札の向きまで分かります。'
    };
  }
  return DEFAULT_META;
}

function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference !== 'system') return preference;
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(typeof window === 'undefined' ? '' : window.location.hash)
  );
  const [preference, setPreference] = useState<ThemePreference>(() => loadTheme());
  const [toast, setToast] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // ハッシュの変化を追う。戻る・進むもこれで拾える。
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash));
      setPending(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // 端末の設定が変わったら、system 指定のときだけ追随する
  useEffect(() => {
    const theme = resolveTheme(preference);
    document.documentElement.setAttribute('data-theme', theme);
    if (preference !== 'system' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      document.documentElement.setAttribute('data-theme', resolveTheme('system'));
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  useEffect(() => {
    applyMeta(metaFor(route));
  }, [route]);

  const navigate = useCallback((hash: string) => {
    if (window.location.hash === hash) {
      setRoute(parseHash(hash));
      return;
    }
    window.location.hash = hash;
  }, []);

  const toggleTheme = () => {
    const next: ThemePreference = resolveTheme(preference) === 'dark' ? 'light' : 'dark';
    setPreference(next);
    saveTheme(next);
  };

  const handleCalcSubmit = (input: GiftInput) => {
    // 一拍おいて計算中の表示を挟む。即座に切り替わるより結果が読まれやすい。
    setPending(true);
    window.setTimeout(() => navigate(buildCalcHash(input)), 420);
  };

  const handleQuizFinish = (token: string) => {
    setPending(true);
    window.setTimeout(() => navigate(buildQuizResultHash(token)), 420);
  };

  const showToast = useCallback((message: string) => setToast(message), []);
  const isDark = resolveTheme(preference) === 'dark';

  const currentNav =
    route.name === 'quiz' || route.name === 'quizResult'
      ? 'quiz'
      : route.name === 'guide'
        ? 'guide'
        : route.name === 'calc'
          ? 'calc'
          : 'home';

  return (
    <div className="app">
      <header className="header">
        <div className="shell header__inner">
          <a className="brand" href="#/">
            <span className="brand__seal" aria-hidden>
              帖
            </span>
            <span className="brand__name">つつみ帖</span>
          </a>
          <nav className="header__nav">
            <a
              className="navlink"
              href="#/calc"
              aria-current={currentNav === 'calc' ? 'page' : undefined}
            >
              金額を調べる
            </a>
            <a
              className="navlink"
              href="#/quiz"
              aria-current={currentNav === 'quiz' ? 'page' : undefined}
            >
              マナー偏差値
            </a>
            <a
              className="navlink"
              href="#/guide"
              aria-current={currentNav === 'guide' ? 'page' : undefined}
            >
              早見表
            </a>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? '明るい表示に切り替える' : '暗い表示に切り替える'}
            >
              {isDark ? <IconSun size={17} /> : <IconMoon size={17} />}
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="shell">
          {pending ? (
            <Loading label="包みをととのえています" />
          ) : route.name === 'home' ? (
            <HomePage />
          ) : route.name === 'calc' && route.submitted && isValidInput(route.input) ? (
            <ResultPage input={route.input} onCopied={() => showToast('URLをコピーしました')} />
          ) : route.name === 'calc' ? (
            <CalcPage initial={route.input} onSubmit={handleCalcSubmit} />
          ) : route.name === 'quiz' ? (
            <QuizPage onFinish={handleQuizFinish} />
          ) : route.name === 'quizResult' ? (
            <QuizResultPage
              token={route.token}
              onCopied={() => showToast('URLをコピーしました')}
            />
          ) : (
            <GuidePage />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="shell footer__inner">
          <p className="footer__note">
            つつみ帖は、冠婚葬祭で包む金額の一般的な目安を示すものです。
            金額と作法は地域・家・宗派によって異なります。最終的な判断は、
            その場をよく知る方に確認したうえで行ってください。
            入力内容はこの端末の中だけで処理され、外部に送信されることはありません。
          </p>
          <div className="footer__links">
            <a href="#/calc">金額を調べる</a>
            <a href="#/quiz">マナー偏差値</a>
            <a href="#/guide">早見表</a>
          </div>
        </div>
      </footer>

      {toast ? <Toast message={toast} onDone={() => setToast(null)} /> : null}
    </div>
  );
}
